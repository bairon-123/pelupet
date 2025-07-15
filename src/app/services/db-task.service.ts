import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbTaskService {
  private dbInstance: SQLiteObject | null = null;

  constructor(private sqlite: SQLite) {
    this.inicializarBD();
  }

  async inicializarBD() {
    try {
      const db = await this.sqlite.create({
        name: 'datos_app2.db',
        location: 'default'
      });
      this.dbInstance = db;

await db.executeSql(
  `CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT,
  nombre TEXT,
  rol TEXT DEFAULT 'usuario',
  activo TEXT
  )`, []
);


      await db.executeSql(`
       CREATE TABLE IF NOT EXISTS perfil (
        usuario_id INTEGER PRIMARY KEY,  -- o UNIQUE
        foto TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
       );`, []
      );


await db.executeSql(`
  CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    nombre_perro TEXT,
    raza TEXT,
    tamano TEXT,
    peso REAL,
    indicaciones TEXT,
    fecha TEXT,
    hora TEXT,
    tipo_servicio TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);`, []);



      console.log('✔️ Base de datos inicializada');
    } catch (error) {
      console.error('❌ Error creando la base de datos', error);
    }
  }

async registrarUsuario(nombre: string, email: string, password: string, rol: string = 'usuario'): Promise<void> {
  if (!this.dbInstance) return;
  try {
    await this.dbInstance.executeSql(
      'INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, password, rol, 'false']
    );
  } catch (error) {
    console.error('❌ Error registrando usuario', error);
  }
}
  
  async validarCredenciales(email: string, password: string): Promise<boolean> {
    if (!this.dbInstance) return false;
    try {
      const res = await this.dbInstance.executeSql(
        'SELECT * FROM usuarios WHERE email = ? AND password = ?',
        [email, password]
      );
      return res.rows.length > 0;
    } catch (error) {
      return false;
    }
  }


async obtenerReserva(email: string): Promise<any | null> {
  if (!this.dbInstance) return null;

  const res = await this.dbInstance.executeSql('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (res.rows.length === 0) return null;

  const userId = res.rows.item(0).id;

  const reservaRes = await this.dbInstance.executeSql(
    'SELECT * FROM reservas WHERE usuario_id = ? ORDER BY id DESC LIMIT 1',
    [userId]
  );

  return reservaRes.rows.length > 0 ? reservaRes.rows.item(0) : null;
}

async obtenerReservasUsuario(email: string): Promise<any[]> {
  if (!this.dbInstance) return [];

  const res = await this.dbInstance.executeSql('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (res.rows.length === 0) return [];

  const userId = res.rows.item(0).id;

  const reservasRes = await this.dbInstance.executeSql(
    'SELECT * FROM reservas WHERE usuario_id = ? ORDER BY id DESC',
    [userId]
  );

  const reservas: any[] = [];
  for (let i = 0; i < reservasRes.rows.length; i++) {
    reservas.push(reservasRes.rows.item(i));
  }

  return reservas;
}

  async activarSesion(email: string): Promise<void> {
    if (!this.dbInstance) return;
    await this.dbInstance.executeSql(
      'UPDATE usuarios SET activo = ? WHERE email = ?',
      ['true', email]
    );
  }
async guardarReservaCompleta(email: string, reserva: any): Promise<void> {
  if (!this.dbInstance) return;

  const res = await this.dbInstance.executeSql('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (res.rows.length === 0) return;

  const userId = res.rows.item(0).id;

  const [fecha, horaCompleta] = reserva.fechaHora.split('T');
  const hora = horaCompleta?.substring(0, 5);

  await this.dbInstance.executeSql(
    `INSERT INTO reservas (
      usuario_id, nombre_perro, raza, tamano, peso, indicaciones, fecha, hora, tipo_servicio
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      reserva.nombrePerro,
      reserva.raza,
      reserva.tamano,
      reserva.peso,
      reserva.indicaciones,
      fecha,
      hora,
      reserva.tipoServicio
    ]
  );
}

async obtenerUsuarioPorCorreo(correo: string): Promise<any> {
  if (!this.dbInstance) return null;

  const res = await this.dbInstance.executeSql(
    'SELECT * FROM usuarios WHERE email = ?',
    [correo]
  );

  if (res.rows.length > 0) {
    return res.rows.item(0); 
  }

  return null;
}

  async haySesionActiva(): Promise<boolean> {
  if (!this.dbInstance) return false;
  try {
    const res = await this.dbInstance.executeSql(
      'SELECT * FROM usuarios WHERE activo = ? LIMIT 1',
      ['true']
    );
    return res.rows.length > 0;
  } catch (error) {
    console.error('Error al verificar sesión activa:', error);
    return false;
  }
}

async obtenerCorreoActivo(): Promise<string | null> {
  if (!this.dbInstance) return null;
  try {
    const res = await this.dbInstance.executeSql(
      'SELECT email FROM usuarios WHERE activo = ? LIMIT 1',
      ['true']
    );
    if (res.rows.length > 0) {
      return res.rows.item(0).email;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener correo activo:', error);
    return null;
  }
}

async obtenerUsuarioActivo(): Promise<any | null> {
  if (!this.dbInstance) return null;
  try {
    const res = await this.dbInstance.executeSql(
      'SELECT * FROM usuarios WHERE activo = ? LIMIT 1',
      ['true']
    );
    if (res.rows.length > 0) {
      return res.rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Error al obtener usuario activo:', error);
    return null;
  }
}

async guardarFotoUsuario(correo: string, foto: string): Promise<void> {
  if (!this.dbInstance) return;

  const res = await this.dbInstance.executeSql('SELECT id FROM usuarios WHERE email = ?', [correo]);
  if (res.rows.length === 0) return;

  const userId = res.rows.item(0).id;

  await this.dbInstance.executeSql(
    `INSERT OR REPLACE INTO perfil (usuario_id, foto) VALUES (?, ?)`,
    [userId, foto]
  );
}



async obtenerFotoUsuario(correo: string): Promise<string | null> {
  if (!this.dbInstance) return null;

  const res = await this.dbInstance.executeSql('SELECT id FROM usuarios WHERE email = ?', [correo]);
  if (res.rows.length === 0) return null;

  const userId = res.rows.item(0).id;

  const fotoRes = await this.dbInstance.executeSql('SELECT foto FROM perfil WHERE usuario_id = ?', [userId]);
  if (fotoRes.rows.length > 0) {
    return fotoRes.rows.item(0).foto;
  }

  return null;
}


  async cerrarSesion(): Promise<void> {
    if (!this.dbInstance) return;
    await this.dbInstance.executeSql(
      'UPDATE usuarios SET activo = ?',
      ['false']
    );
  }
}

