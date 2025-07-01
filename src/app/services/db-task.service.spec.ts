import { TestBed } from '@angular/core/testing';
import { DbTaskService } from './db-task.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('DbTaskService', () => {
  let service: DbTaskService;
  let sqliteSpy: jasmine.SpyObj<SQLite>;
  let mockDb: any;

  beforeEach(() => {
    mockDb = jasmine.createSpyObj('SQLiteObject', ['executeSql']);
    sqliteSpy = jasmine.createSpyObj('SQLite', ['create']);
    sqliteSpy.create.and.returnValue(Promise.resolve(mockDb));

    TestBed.configureTestingModule({
      providers: [
        DbTaskService,
        { provide: SQLite, useValue: sqliteSpy }
      ]
    });

    service = TestBed.inject(DbTaskService);
    (service as any).dbInstance = mockDb; // inyectamos la instancia falsa directamente
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store user photo', async () => {
    const email = 'test@correo.com';
    const userId = 1;
    const foto = 'data:image/jpeg;base64,...';

    // Mock para obtener ID del usuario
    mockDb.executeSql.withArgs('SELECT id FROM usuarios WHERE email = ?', [email])
      .and.returnValue(Promise.resolve({ rows: { length: 1, item: () => ({ id: userId }) } }));

    // Mock para guardar la foto
    mockDb.executeSql.withArgs(
      'INSERT OR REPLACE INTO perfil (usuario_id, foto) VALUES (?, ?)',
      [userId, foto]
    ).and.returnValue(Promise.resolve());

    await service.guardarFotoUsuario(email, foto);

    expect(mockDb.executeSql).toHaveBeenCalledWith(
      'INSERT OR REPLACE INTO perfil (usuario_id, foto) VALUES (?, ?)',
      [userId, foto]
    );
  });

  it('should retrieve user photo', async () => {
    const email = 'test@correo.com';
    const userId = 1;
    const foto = 'data:image/jpeg;base64,...';

    mockDb.executeSql.withArgs('SELECT id FROM usuarios WHERE email = ?', [email])
      .and.returnValue(Promise.resolve({ rows: { length: 1, item: () => ({ id: userId }) } }));

    mockDb.executeSql.withArgs('SELECT foto FROM perfil WHERE usuario_id = ?', [userId])
      .and.returnValue(Promise.resolve({ rows: { length: 1, item: () => ({ foto }) } }));

    const result = await service.obtenerFotoUsuario(email);

    expect(result).toBe(foto);
  });
});
