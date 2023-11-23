import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit{

  listadoEspecialistas : any[] = [];

  constructor(private usuarioService : UsuarioService, private auth : AngularFireAuth){

  }

  ngOnInit(): void {
    this.usuarioService.traerTodos().subscribe((listadoUsuarios) => {

      this.listadoEspecialistas = listadoUsuarios.map(usuarioRef => {
        let usuario : any = usuarioRef.payload.doc.data();
        usuario['id'] = usuarioRef.payload.doc.id;
        return usuario;
      })
      //console.log(this.listadoEspecialistas);

    });

    /*this.usuarioService.traerTodos().subscribe((listado : any[]) => {
      for(let i of listado){
        if (i.tipo == 'especialista' && !i.estadoAprobadoPorAdmin){
          this.listadoEspecialistas.push(i);
        }
      }
      console.log("Lenght listadoEspecialista " + this.listadoEspecialistas.length);
    });*/
  }

  aceptar(especialista : any){
    especialista.estadoAprobadoPorAdmin = true;
  }

  cancelar(id : string){
    console.log(id);
    this.usuarioService.delete(id).then(res => {
      console.log("Se elimino con exito");
    }).catch(err => {
      console.log("ERROR al eliminar ", err);
    });
  }

/*  traer(){
    this.usuarioService.traerTodos().subscribe((listaDeUsuariosRef) => {

        this.listadoEspecialistas = listaDeUsuariosRef.map(usuarioRef => {
          let usuario : any = usuarioRef.payload.doc.data();
          usuario['id'] = usuarioRef.payload.doc.id;
          return usuario;
        })
        console.log(this.listadoEspecialistas);

      });
    }*/

  }


