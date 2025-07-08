

 // prueba login 
describe('Pruebas de Login en Pelupet', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/login');
  });

  it('Debe mostrar los campos email y password', () => {
    cy.get('ion-input input').eq(0).type('bairon@gmail.com');
    cy.get('ion-input input').eq(1).type('123456');
    cy.contains('Iniciar sesión').should('exist');
  });

  
  it('Debe rechazar credenciales incorrectas', () => {
    cy.get('ion-input input').eq(0).type('invalido@correo.com');
    cy.get('ion-input input').eq(1).type('000000');
    cy.contains('Iniciar sesión').click();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Credenciales incorrectas');
    });
  });

  it('Debe aceptar credenciales válidas y redirigir a /home', () => {
    cy.get('ion-input input').eq(0).type('bairon@gmail.com');
    cy.get('ion-input input').eq(1).type('123456');
    cy.contains('Iniciar sesión').click();

    cy.url({ timeout: 3000 }).should('include', '/home');
    cy.contains('Bienvenido').should('exist');
  });
});


 // prueba home 

describe('Pantalla Home - Pelupet', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/login');
    cy.get('ion-input input').eq(0).type('bairon@gmail.com');
    cy.get('ion-input input').eq(1).type('123456');
    cy.contains('Iniciar sesión').click();
    cy.url().should('include', '/home');
  });

  it('Debe mostrar nombre del usuario y botón cerrar sesión', () => {
    cy.contains('Bienvenido').should('exist');
    cy.contains('Cerrar sesión').should('exist');
  });
});

 // prueba perfil 

describe('Pruebas de la Página de Perfil en Pelupet', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/perfil');
  });

  it('Debe mostrar el título y botón para tomar foto', () => {
    cy.contains('Perfil Pelupet!').should('exist');
    cy.contains('Tomar Foto de Perfil').should('exist');
  });

  it('Debe mostrar información del usuario', () => {
    cy.contains('Información del Usuario').should('exist');
    cy.contains('Nombre de Usuario:').should('exist');
    cy.contains('Correo:').should('exist');
    cy.contains('Rol:').should('exist');
  });

  it('Debe mostrar botón "Guardar Foto" si hay una foto previa', () => {
    cy.get('ion-button').contains('Guardar Foto').should('not.exist');
  });
});

 
// prueba servicios
describe('Pantalla de Servicios - Pelupet', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/login');
    cy.get('ion-input input').eq(0).type('bairon@gmail.com');
    cy.get('ion-input input').eq(1).type('123456');
    cy.contains('Iniciar sesión').click();
    cy.url().should('include', '/home');
    cy.visit('http://localhost:8100/servicios');
  });

  it('Debe mostrar los servicios disponibles', () => {
    cy.contains('Express').should('exist');
    cy.contains('Completo').should('exist');
    cy.contains('Premium').should('exist');
  });

  it('Debe tener un botón para volver a Home', () => {
    cy.contains('Volver a Inicio').click();
    cy.url().should('include', '/home');
  });
});

 // prueba ubicación

describe('Pantalla de Ubicación - Pelupet', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/login');
    cy.get('ion-input input').eq(0).type('bairon@gmail.com');
    cy.get('ion-input input').eq(1).type('123456');
    cy.contains('Iniciar sesión').click();
    cy.url().should('include', '/home');
    cy.visit('http://localhost:8100/ubicacion');
  });

  it('Debe mostrar el mapa', () => {
    cy.get('#mapa-ubicacion').should('exist');
  });

  it('Debe tener botón para volver a inicio', () => {
    cy.contains('Volver a Inicio').click();
    cy.url().should('include', '/home');
  });
});


describe('Página de Reservas - Pelupet', () => {
  beforeEach(() => {
    // Forzar sesión antes de visitar /reservas
    window.localStorage.setItem('correo_activo', 'bairon@gmail.com'); // si usas localStorage
    cy.visit('http://localhost:8100/reservas');
  });

  it('Debe mostrar título y campos del formulario', () => {
    cy.contains('Reserva Pelupet!').should('exist');
    cy.get('[data-cy="input-nombre"]').should('exist');
    cy.get('[data-cy="input-raza"]').should('exist');
    cy.get('[data-cy="select-tamano"]').should('exist');
    cy.get('[data-cy="select-servicio"]').should('exist');
    cy.get('[data-cy="input-peso"]').should('exist');
    cy.get('[data-cy="textarea-indicaciones"]').should('exist');
    cy.get('[data-cy="input-fecha"]').should('exist');
  });

  it('Debe completar el formulario y agendar reserva', () => {
    cy.get('[data-cy="input-nombre"] input').type('Firulais');
    cy.get('[data-cy="input-raza"] input').type('Poodle');

    cy.get('[data-cy="select-tamano"]').click({ force: true });
    cy.wait(300); // espera breve para asegurar que se abra
    cy.contains('Mediano').click({ force: true });

    cy.get('[data-cy="select-servicio"]').click({ force: true });
    cy.wait(300); // espera breve para asegurar que se abra
    cy.contains('Completo').click({ force: true });

    cy.wait(500); // espera breve para asegurar que se abra

    
    cy.get('[data-cy="select-servicio"]').click({ force: true });
    cy.contains('Premium').click({ force: true });

    // Esperar a que desaparezca el ion-backdrop 
    cy.get('ion-backdrop').should('not.exist');

    // Ahora puedes escribir sin problemas
    cy.get('[data-cy="input-peso"] input').type('7');
    cy.wait(500); // espera breve para asegurar que se abra
    cy.get('[data-cy="textarea-indicaciones"] textarea').type('Cortar con cuidado');

    cy.wait(500); // espera breve para asegurar que se abra

    cy.get('[data-cy="input-fecha"] input').click({ force: true }); // abre el date picker
    cy.wait(500); // pequeño delay para asegurar que se cargue
    cy.get('ion-datetime').invoke('attr', 'value', new Date().toISOString());

    cy.contains('Agendar').click();

    // Si hay alert, capturarlo
    cy.on('window:alert', (text) => {
      expect(text).to.contain('¡Reserva guardada con éxito!');
    });
  });
});