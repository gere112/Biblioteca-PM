import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import { IonModal, AlertController, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
})

export class HomePage implements OnInit {
  users: any[] = [];
  @ViewChild(IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string = '';
  password: string = '';
  email: string = '';

  constructor(private userService: UsersService, private alertController: AlertController, private modalController: ModalController) { }



  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'ERROR',
      message: message,
      buttons: ['OK']
    })

    await alert.present();
  }


  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    // Este es un método en la clase HomePage que se llama cuando se inicia la página.

    // Se utiliza para cargar la lista de usuarios desde el servidor.

    this.userService.getUsers().subscribe((resp) => {
      // Usamos el servicio `userService` para realizar una solicitud HTTP al servidor
      // y obtener la lista de usuarios. El método `getUsers()` devuelve un Observable.

      // Cuando la solicitud se complete con éxito, el servidor enviará una respuesta `resp`.

      this.users = resp.users;
      // Aquí, asignamos la lista de usuarios obtenida de la respuesta al array `this.users`.
      // Esto actualiza la lista de usuarios en la página con los datos del servidor.
    });
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    // Validar si el nombre de usuario contiene solo letras
    if (!/^[A-Za-z]+$/.test(this.name)) {
      // Si el nombre de usuario no contiene solo letras, muestra una alerta
      this.showAlert('El nombre de usuario solo puede contener letras.');
      return; // Detiene el proceso de confirmación si la validación falla
    }
  
    // Si la validación es exitosa y el nombre de usuario contiene solo letras
    const newUser = {
      username: this.name,
      password: this.password,
      email: this.email
    };
  
    // Agregar el nuevo usuario utilizando el servicio userService
    this.userService.addUser(newUser).subscribe((addedUser) => {
      // Carga la lista de usuarios después de agregar uno nuevo
      this.loadUsers();
      // Cierra el modal una vez que se agrega exitosamente el usuario
      this.modal.dismiss(null, 'confirm');
    });
  }
  

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  async editUser(user: any) {
    const alert = await this.alertController.create({
      header: 'Editar Usuario',
      inputs: [
        {
          name: 'username',
          type: 'text',
          value: user.username,
          placeholder: 'Nombre de Usuario'
        },
        {
          name: 'password',
          type: 'password',
          value: user.password,
          placeholder: 'Contraseña'
        },
        {
          name: 'email',
          type: 'email',
          value: user.email,
          placeholder: 'Correo Electrónico'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            // Llama a la función para actualizar el usuario en el servidor con los valores en `data`.
            this.userService.updateUser(user.id, data).subscribe(() => {
              this.loadUsers(); // Recarga la lista de usuarios después de actualizar uno existente
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmDelete(user: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar a este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.userService.deleteUser(user.id).subscribe(() => {
              this.loadUsers();
            });
          }
        }
      ]
    });

    await alert.present();
  }
}

