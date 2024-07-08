
import React,{useEffect,useState} from 'react';
import axios, { Axios } from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../function';
import { useNavigate } from 'react-router-dom'; 



const Showusers = () => {
    const url='http://127.0.0.1:8000/api/users/';
    const [id,setId] = useState('');
    const [users,setUsers] = useState([])
    const [first_name,setFirst_name] = useState('');
    const [last_name,setLast_name] = useState('');
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [operacion,setOperacion] = useState(1);
    const [title,setTitle] = useState('');
    const navigate = useNavigate();

    useEffect( ()=>{
        getUsers();
    },[])

        const getUsers = async () =>{
            const respuesta = await axios.get(url);
            setUsers(respuesta.data);
        }

        const openModal = (op,id,first_name,last_name,username,email) =>{
            setId('');
            setFirst_name('');
            setLast_name('');
            setUsername('');
            setEmail('');
            setOperacion(op);
            if(op === 1){
                setTitle('Registrar Usuario');
            }else if(op === 2){
            setTitle('Registrar Usuario');
            setId(id);
            setFirst_name(first_name);
            setLast_name(last_name);
            setUsername(username);
            setEmail(email);
            }
            window.setTimeout(function(){
                document.getElementById('nombre').focus();
            },500)
        }

        const validar = () =>{
            var parametros;
            var metodos;
            if(first_name.trim()===''){
                show_alerta('Escriba el Nombre','warning');
            }else if(last_name.trim()===''){
                show_alerta('Escriba el Apellido','warning');
            }else if(username.trim()===''){
                show_alerta('Escriba el User','warning');
            }else if(email.trim()===''){
                show_alerta('Escriba el email','warning');
            }else{
                if(operacion === 1){
                    parametros = {first_name:first_name.trim(),last_name:last_name.trim(),username:username.trim(),email:email.trim()};
                    metodos = 'POST';
                }else{
                    parametros= {id:id,first_name:first_name.trim(),last_name:last_name.trim(),username:username.trim(),email:email.trim()};
                    metodos = 'PUT';
                }
                enviarSolicitud(metodos,parametros);
                getUsers(); 
                   
                    navigate(0);
            }    
        };

        const enviarSolicitud = async (metodos,parametros) => {
            await axios({method:metodos, url:`http://127.0.0.1:8000/api/users/${id}/`, data:parametros}).then(function(respuesta){
                var tipo = respuesta.data[0];
                var msj = respuesta.data[1];
                show_alerta(msj,tipo);
                if(tipo === 'success'){
                    document.getElementById('btnCerrar').click();
                    
                }
            })

        };

        

        const deleteUsers = (id, first_name) => {
            
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: 'Seguro que desea eliminar el usuario ' + ': ' + first_name + '?',
                icon: 'question',
                text: 'No se podrá dar marcha atrás',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    setId(id);
                    console.log("ID del usuario a eliminar:", id);
                    axios.delete(`http://127.0.0.1:8000/api/users/${id}/`) 
                        .then(function (response) {
                            var tipo = response.data[0];
                            var msj = response.data[1];
                            show_alerta(msj, tipo);
                            getUsers(); 
                            navigate(0);
                        })
                        .then(data=>{
                            console.log(data);
                        })
                } else {
                    show_alerta('El usuario NO fue eliminado', 'info');
                }
          
            });
            
        }
            

       


  return (
    <div>
        <div className='container-fluid'>
        <div className='row mt-3'>
                <div className='col-md-4 offset-md-3'>
                    <div className='d-grid mx-auto'>
                        <button onClick={()=>openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalUsers'style={{
                    width: '180px',}}>
                            <i className='fa-solid fa-circle-plus'></i> Añadir Usuario
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className='row mt-3'>
            <div className='col-12 col-lg-8 offset-0 offset-lg-3'>
                <div className='table table-bordered'>
                    <thead>
                        <tr><th>#</th><th>NOMBRE</th><th>APELLIDO</th><th>USERNAME</th><th>EMAIL</th></tr>
                    </thead>
                    <tbody className='table-group-divider'>
                        {users.map( (users,id)=>(
                            <tr key={users.id}>
                                <td>{(users.id)}</td>
                                <td>{users.first_name}</td>
                                <td>{users.last_name}</td>
                                <td>{users.username}</td>
                                <td>{users.email}</td>
                                <td>
                                    <button onClick={()=>openModal(2,users.id,users.first_name,users.last_name,users.username,users.email)} 
                                    className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalUsers'>
                                        <i className='fa-solid fa-edit'></i>
                                    </button>
                                    &nbsp;
                                    <button onClick={()=>deleteUsers(users.id,users.first_name)} className='btn btn-danger'>
                                        <i className='fa-solid fa-trash'></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </div>
            </div>
        </div>
        <div id='modalUsers' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-file-signature'></i></span>
                            <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={first_name} onChange={(e)=> setFirst_name(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-file-signature'></i></span>
                            <input type='text' id='apellido' className='form-control' placeholder='Apellidos' value={last_name} onChange={(e)=> setLast_name(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                            <input type='text' id='UsEr' className='form-control' placeholder='User' value={username} onChange={(e)=> setUsername(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-envelope'></i></span>
                            <input type='email' id='emaill' className='form-control' placeholder='Email' value={email} onChange={(e)=> setEmail(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={() =>validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Showusers