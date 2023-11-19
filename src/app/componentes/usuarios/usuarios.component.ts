import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit{

  listadoEspecialistas : any[] = [];

  constructor(private usuarioService : UsuarioService){

  }

  ngOnInit(): void {
    this.usuarioService.traerTodos().subscribe((listado : any[]) => {
      console.log("Lenght " + listado.length);
      for(let i of listado){
        if (i.tipo == 'especialista' && !i.estadoAprobadoPorAdmin){
          console.log(i);
          this.listadoEspecialistas.push(i);
          console.log('entre al if');
        }
      }
    });
  }
}
