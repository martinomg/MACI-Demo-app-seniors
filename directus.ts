
const directusUrl = import.meta.env.VITE_DIRECTUS_URL;
const directusToken = import.meta.env.VITE_DIRECTUS_TOKEN;

export interface Oportunidad {
  titulo: string;
  descripcion: string;
  horario?: string;
  url?: string;
  perfil_requerido?: string;
  ubicacion?: string;
  perfil?: string; // Foreign key to the 'perfiles' item
}

// Function to create a new profile and get its ID
export async function createProfile(description: string): Promise<string | null> {
  try {
    const response = await fetch(`${directusUrl}/items/perfiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${directusToken}`,
      },
      body: JSON.stringify({
        descripcion: description,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.id;
  } catch (error) {
    console.error("Error creating profile:", error);
    return null;
  }
}

// Function to update a profile with raw results
export async function updateProfileWithRawResults(profileId: string, rawResults: any): Promise<void> {
  try {
    const response = await fetch(`${directusUrl}/items/perfiles/${profileId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${directusToken}`,
      },
      body: JSON.stringify({
        resultados_raw: rawResults,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating profile with raw results:", error);
  }
}

// Function to create multiple opportunities linked to a profile
export async function createOportunidades(profileId: string, oportunidades: Omit<Oportunidad, 'perfil'>[]): Promise<void> {
  const opportunitiesWithProfileId = oportunidades.map(op => ({
    ...op,
    perfil: profileId,
  }));

  try {
    const response = await fetch(`${directusUrl}/items/oportunidades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${directusToken}`,
      },
      body: JSON.stringify(opportunitiesWithProfileId),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Error creating opportunities:', errorBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error creating opportunities:", error);
  }
}
