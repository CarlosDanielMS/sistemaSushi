// frontend/src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3003', // Substitua pela URL real do seu backend
});

export class UsuarioService {
    
    listaUsuarios() {
        return api.get('/sistema/usuarios');
    }
}