/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { GoogleGenAI } from "@google/genai";
import { createProfile, updateProfileWithRawResults, createOportunidades, Oportunidad } from "./directus";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Textarea, Label } from "./components/ui";

interface JobOpportunity {
  title: string;
  company: string;
  location: string;
  skills: string[];
  review: string;
  url: string;
}

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>([]);
  const [groundingChunks, setGroundingChunks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findOpportunities = async () => {
    if (!userInput.trim()) {
      setError("Por favor, describe tus habilidades y ubicación.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOpportunities([]);
    setGroundingChunks([]);

    let profileId: string | null = null;

    try {
      // 1. Create profile in Directus
      profileId = await createProfile(userInput);
      if (!profileId) {
        throw new Error("No se pudo crear el perfil en Directus.");
      }

      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY as string });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Basado en el siguiente perfil de usuario, busca en Google y genera 3 oportunidades laborales REALES y actuales: "${userInput}".

        Devuelve los resultados EXCLUSIVAMENTE en un formato JSON como el siguiente, sin texto adicional antes o después del bloque JSON:
        {
          "opportunities": [
            {
              "title": "Título del puesto",
              "company": "Nombre de la Empresa",
              "location": "Ubicación",
              "skills": ["Habilidad 1", "Habilidad 2"],
              "review": "Análisis de por qué es una buena oportunidad.",
              "url": "https://example.com/job/123"
            }
          ]
        }`,
        config: {
          systemInstruction: `Eres un asesor de carrera especializado en encontrar oportunidades laborales significativas y adecuadas para adultos mayores. Tu tono debe ser alentador, respetuoso y profesional. Utiliza la búsqueda de Google para encontrar oportunidades laborales REALES que se ajusten a las habilidades y la ubicación proporcionadas por el usuario. Enfócate en roles flexibles, de tiempo parcial o que valoren la experiencia de vida. Siempre debes incluir una URL válida para cada oportunidad.`,
          tools: [{ googleSearch: {} }],
        },
      });
      
      // 2. Update profile with raw results
      await updateProfileWithRawResults(profileId, { raw_response: response.text });


      setGroundingChunks(
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      );
      
      // Robust JSON parsing
      let jsonString = response.text;
      const jsonStart = jsonString.indexOf('{');
      const jsonEnd = jsonString.lastIndexOf('}') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error("No se encontró un objeto JSON válido en la respuesta del modelo.");
      }

      jsonString = jsonString.substring(jsonStart, jsonEnd);
      const parsedResponse = JSON.parse(jsonString);


      if (Array.isArray(parsedResponse.opportunities)) {
          setOpportunities(parsedResponse.opportunities);
          
          // 3. Create structured opportunities in Directus
          const opportunitiesToCreate: Omit<Oportunidad, 'perfil'>[] = parsedResponse.opportunities.map((job: JobOpportunity) => ({
            titulo: job.title,
            descripcion: job.review,
            ubicacion: job.location,
            perfil_requerido: job.skills.join(', '),
            url: job.url,
            horario: 'No especificado' // Default value or extract from job details if available
          }));

          await createOportunidades(profileId, opportunitiesToCreate);

      } else {
          throw new Error("El formato de las oportunidades laborales en la respuesta es incorrecto.");
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Hubo un error al buscar oportunidades. Por favor, inténtalo de nuevo más tarde.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container">
      <header className="header">
        <h1>Senior Laboral</h1>
        <p>Encuentra tu próxima oportunidad profesional</p>
      </header>

      <div className="search-area" role="search">
        <Label htmlFor="user-prompt">
          Describe tus habilidades y tu ubicación
        </Label>
        <Textarea
          id="user-prompt"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ej: Tengo experiencia en contabilidad y atención al cliente, y vivo en la Ciudad de México. Busco algo de medio tiempo."
          rows={4}
          aria-label="Describe tus habilidades y tu ubicación"
        />
        <Button onClick={findOpportunities} disabled={isLoading}>
          {isLoading ? "Buscando..." : "Buscar Oportunidades"}
        </Button>
      </div>

      {error && (
        <div className="error-message" role="alert">
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner" aria-label="Cargando resultados"></div>
          <p>Analizando tu perfil para encontrar las mejores opciones...</p>
        </div>
      )}

      <section className="results-panel" aria-live="polite">
        {opportunities.length > 0 && <h2>Oportunidades para ti</h2>}
        {opportunities.map((job, index) => (
          <Card key={index} className="job-card">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>
                {job.company} - {job.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600' }}>¿Por qué es una buena oportunidad para ti?</h4>
                <p style={{ marginBottom: '1rem' }}>{job.review}</p>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600' }}>Habilidades clave</h4>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                  {(job.skills || []).map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => window.open(job.url, '_blank', 'noopener,noreferrer')}
              >
                Ver Oferta
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
      
      {groundingChunks.length > 0 && (
          <section className="sources-section">
            <h4>Fuentes</h4>
            <ul>
              {groundingChunks.map((chunk, index) => (
                chunk.web && <li key={index}><a href={chunk.web.uri} target="_blank" rel="noopener noreferrer">{chunk.web.title || chunk.web.uri}</a></li>
              ))}
            </ul>
          </section>
        )}
    </main>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);