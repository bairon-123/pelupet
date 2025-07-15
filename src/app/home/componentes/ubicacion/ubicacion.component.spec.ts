

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UbicacionPage } from './ubicacion.component';
import { NavController } from '@ionic/angular';

describe('UbicacionPage', () => {
  let component: UbicacionPage;
  let fixture: ComponentFixture<UbicacionPage>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateBack']);

    await TestBed.configureTestingModule({
      imports: [UbicacionPage],
      providers: [
        { provide: NavController, useValue: navCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UbicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería navegar de regreso al home al llamar irHome()', () => {
    component.irHome();
    expect(navCtrlSpy.navigateBack).toHaveBeenCalledWith('/home');
  });
});  