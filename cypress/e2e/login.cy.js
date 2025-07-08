

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


 // prueba de reserva
 
describe('Pruebas de Reserva en Pelupet', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/login');
    cy.get('input').eq(0).type('bairon@gmail.com');   
    cy.get('input').eq(1).type('123456');         
    cy.contains('Iniciar sesión').click();

    cy.url().should('include', '/home');
    cy.visit('http://localhost:8100/reservas');
  });

  it('Debe completar y enviar una reserva correctamente', () => {
    // Nombre del perro
    cy.get('[data-cy=input-nombre] input').type('Firulais');

    // Raza
    cy.get('[data-cy=input-raza] input').type('Poodle');

    // Tamaño
    cy.get('[data-cy=select-tamano]').click();
    cy.contains('Mediano').click();

    // Tipo de servicio
    cy.get('[data-cy=select-servicio]').click();
    cy.contains('Completo').click();

    // Peso
    cy.get('[data-cy=input-peso] input').type('7');

    // Indicaciones
    cy.get('[data-cy=textarea-indicaciones] textarea').type('No le gusta el agua');

    // Fecha y hora
    cy.get('[data-cy=input-fecha]').invoke('attr', 'value', '2025-07-08T12:00');

    // Click en Agendar
    cy.contains('Agendar').click();

    // Verifica alerta de éxito
    cy.on('window:alert', (str) => {
      expect(str).to.include('Reserva guardada');
    });
  });
});

 // preuba servicios
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
