import React from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Input,
  Label,
  Textarea
} from './components/ui';

export function Example() {
  return (
    <div className="container">
      <h1>Componentes UI - Estilo Shadcn</h1>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>Botones</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Card</h2>
        <Card style={{ maxWidth: '400px' }}>
          <CardHeader>
            <CardTitle>Título de la Card</CardTitle>
            <CardDescription>Esta es una descripción de la card con estilo shadcn</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Contenido de la card. Aquí puedes agregar cualquier contenido.</p>
          </CardContent>
          <CardFooter>
            <Button>Acción</Button>
          </CardFooter>
        </Card>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Formulario</h2>
        <Card style={{ maxWidth: '400px' }}>
          <CardHeader>
            <CardTitle>Formulario de Ejemplo</CardTitle>
            <CardDescription>Completa los campos a continuación</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" placeholder="Ingresa tu nombre" style={{ marginTop: '0.5rem' }} />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" style={{ marginTop: '0.5rem' }} />
              </div>
              
              <div>
                <Label htmlFor="message">Mensaje</Label>
                <Textarea id="message" placeholder="Escribe tu mensaje aquí..." style={{ marginTop: '0.5rem' }} />
              </div>
            </div>
          </CardContent>
          <CardFooter style={{ gap: '0.5rem' }}>
            <Button variant="outline">Cancelar</Button>
            <Button>Enviar</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}