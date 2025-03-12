/**
 *  * Autor: jl_
  * ADSI - SENA
   * email: devluisluzardo@gmail.com
    * Fecha creacion : 21 - Feb - 2025
     * 
      * desscripcion:
       * 
       **/

// Firebase: Authentication
// Google Firebase : Google Popu up
import {initializeApp} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Firebase: RealTime Database
import {
    getDatabase,
    ref,
    set,
    onValue,
    query,
    orderByKey,
    get,
    limitToLast,
    equalTo,
    child,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// texto original: plantilla contacto whp form
const input = document.getElementById("textwhpform");

// Importa la función desde index.js
// import { miFuncion} from './whpformconvert.js';
// Llama a la función importada

let direccion = "",
    celular = "",
    ciudad = "";

// Firebase: Initialize service
const firebaseApp = initializeApp({
    apiKey: "AIzaSyA58GQ4lc3s8BVZECdGvBgEyeoGqs3PAXw",
    authDomain: "gmynimaxiproductos.firebaseapp.com",
    databaseURL: "https://gmynimaxiproductos-default-rtdb.firebaseio.com",
    projectId: "gmynimaxiproductos",
    storageBucket: "gmynimaxiproductos.firebasestorage.app",
    messagingSenderId: "298345288781",
    appId: "1:298345288781:web:f922cbe731ef41c2f4f804",
    measurementId: "G-WL73MRRKNM"
});

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider(firebaseApp);

// Asignamos el objeto a la constante
// Obtenemos el elemento, imagen,...
const login = document.getElementById("accedergoogle");
const cerrarsesion = document.getElementById("cerrarsesion");
const emailsesion = document.getElementById("emailinisesion");
const logininac = document.getElementById("logininac");
const loginac = document.getElementById("loginac");
// const myDiv = document.getElementById("sliderinisesion");
const info = document.getElementById("idinfo");
const loginactivo = document.getElementById("loginactivo");
const cmdlimpiar = document.getElementById("cmdlimpiar");
const textwhp = document.getElementById("textwhpform");
const result = document.getElementById("resultado");
const idresout = document.getElementById("idresout");
const cmdgrabaregcontacti = document.getElementById("cmdgrabaregcontacti");

// roles firebase
const database = getDatabase();
const roleDisplay = document.getElementById('roleDisplay');
const adminActionBtn = document.getElementById('adminActionBtn');
const adminPanel = document.getElementById('adminPanel');
const assignRoleBtn = document.getElementById('assignRoleBtn');
let userRole = null;

login.addEventListener("click", (e) => {
    signInWithRedirect(auth, provider);

    getRedirectResult(auth).then((result) => { // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;

    }).catch((error) => { // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
});

// CERRAR SESION
cerrarsesion.addEventListener("click", (e) => {
    auth.signOut().then(() => { // Cierre de sesión exitoso
        document.getElementById("login").style.display = "block";
        // habilitar cuentas google
        document.getElementById("accedergoogle").style.display = "block";
        // Ocultar Cerrar sesion
        document.getElementById("cerrarsesion").style.display = "none";
        // Mostrar texto
        document.getElementById("emailinisesion").innerText = "Email";
        // //console.log('Sesión cerrada correctamente.');
        // Aquí puedes redirigir al usuario a una página de inicio de sesión o mostrar un mensaje de confirmación.
        // Recargar la página *después* del cierre de sesión
        window.location.reload();
    }).catch((error) => { // Manejo de errores
        console.error('Error al cerrar sesión:', error);
    });
});
// ---

// AL cambiar el estado de autenticacion
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        const uname = user.displayName;
        const uemail = user.email;
        const roles = "";
        let id = 1;

        const emailEncoded = btoa(uemail); // Codificar el email en Base64
        const db = getDatabase();
        const dbf = ref(db, 'usuario/idkey:' + emailEncoded);
        onValue(dbf, (snapshot) => {
            let data = snapshot.val();
            if (data !== null) { // Roles de usuario
                const userRoleRef = ref(db, `usuario/idkey:${emailEncoded}/role`);
                onValue(userRoleRef, (snapshot) => {
                    let role_ = snapshot.val();
                    if (role_ == null) {
                        role_ = "Rol de Usuario. No Asignado.";
                    }
                    document.getElementById("roleusuario").innerText = role_;

                    // verificar los tipo de roles y asignat acciones
                    if (role_ == "admin") {
                        document.getElementById("botones-container").display = "block";
                    } else {
                        document.getElementById("botones-container").display = "none";
                    }
                    //

                });
                // fin Roles de usuario

                // Si data no es nulo, significa que hay un valor en el nodo
                // /console.log('Hay un valor en el nodo: ......... ');
                // console.log(data);

                // info.value = "Usuario autenticado. " + uemail;

                // --- porque el usuario ya fue autenticado
                // ocultar login
                document.getElementById("login").style.display = "none";
                // ver login activo.
                document.getElementById("loginactivo").style.display = "block";
                // bloquear cuentas google
                document.getElementById("accedergoogle").style.display = "none";
                // ver Cerrar sesion
                document.getElementById("cerrarsesion").style.display = "block";
                // Modtrar texto
                document.getElementById("emailinisesion").innerText = uemail;
                // myDiv.style.backgroundColor = "lightblue";
                // ocultar login inactivo
                document.getElementById("logininac").style.display = "none";
                // ---
            } else {
                // --- porque el usuario no ha sido autenticado
                // Ver login
                document.getElementById("login").style.display = "block";
                // ocultar login activo.
                document.getElementById("loginactivo").style.display = "none";
                // Ocultar Cerrar sesion
                document.getElementById("cerrarsesion").style.display = "none";
                // Mostrar texto
                document.getElementById("emailinisesion").innerText = "Email";
                // myDiv.style.backgroundColor = "lightblue";
                // Ver login inactivo
                document.getElementById("logininac").style.display = "block";
                // ---
                // Si data es nulo, significa que no hay un valor en el nodo
                // console.log('No hay un valor en el nodo');
                const path = 'usuario/idkey:' + emailEncoded;
                // Luego, puedes usar 'path' en tu función set
                set(ref(db, path), {
                    nombre: uname,
                    email: uemail,
                    key: uid,
                    idrol: 4,
                    idnivel: 2
                });
            }
        });
        // ...
    } else {
        // User is signed out .
        // Desplegamos
        login.style.display = "block";
        loginactivo.style.display = "none";
        emailsesion.style.display = "none";
        cerrarsesion.style.display = "none";
        logininac.style.display = "block";
        loginac.style.display = "none";
        // myDiv.style.backgroundColor = "lightblue";
    }
});
// FIN AL cambiar ...

function assignRole(uid, role) {
    const userRoleRef = ref(database, `users/${uid}/role`);
    set(userRoleRef, role).then(() => {
        console.log(`Rol ${role} asignado a ${uid}`);
    }).catch((error) => {
        console.error('Error al asignar rol:', error);
    });
}

const cancelButton = document.getElementById('');
const productList = document.getElementById('product-list');
const productNameInput = document.getElementById('product-name');
const addProductButton = document.getElementById('idbtnadd');
const saveButton = document.getElementById('idbtngrabar');
const eliminarButton = document.getElementById('idbtneliminar');
const editarButton = document.getElementById('idbtnedit');
const nuevoButton = document.getElementById('idbtnuevo');
const produNameAnterior = "";
// DOM elements

// CRUD - PRODUCTOS
onAuthStateChanged(auth, (user) => {
    if (user) { // Usuario autenticado
        user.getIdTokenResult().then((idTokenResult) => { // Aquí tienes el resultado del token de ID
            const token = idTokenResult.token;
            const claims = idTokenResult.claims;

            // Mostrar el token y claims en la consola
            console.log("Token de ID:", token);
            console.log("Claims:", claims);
        }).catch((error) => {
            console.error("Error al obtener el resultado del token de ID:", error);
        });

        // ini grabar datos
        addProductButton.addEventListener("click", (e) => {
            const productName = productNameInput.value;
            if (productName.trim() !== "") {
                const db = getDatabase();
                const dbf = ref(db, 'productos/producto:' + productName);
                onValue(dbf, (snapshot) => {
                    let data = snapshot.val();
                    if (data == null) {
                        const path = 'productos/producto:' + productName;
                        // Luego, puedes usar 'path' en tu función set
                        set(ref(db, path), {nombre: productName});
                        localStorage.removeItem(productNameInput.value);
                        // window.location.reload();
                        document.getElementById('idproducname').innerText = "Nombre Producto : " + productName;
                        productNameInput.value = "";
                        productNameInput.focus();
                    } else {
                        console.log("Nombre Producto No Existe!");
                    }
                });
            } else {
                console.log("Digite Nombre Producto");
            }
        });
        // fin grabar datos

        // Ini eliminar datos
        eliminarButton.addEventListener("click", (e) => {
            const productName = productNameInput.value;
            if (productName.trim() !== "") {
                const db = getDatabase();
                const productRef = ref(db, 'productos/producto:' + productName);
                remove(productRef).then(() => {
                    document.getElementById('product-name').innerText = "";
                    localStorage.removeItem(productNameInput.value);
                    window.location.reload();
                    console.log('Registro eliminado correctamente');
                }).catch((error) => {
                    console.error('Error al eliminar el registro:', error);
                });
            } else {
                console.log("Digite Nombre Producto");
            }
        });
        // fin eliminar datos

        // ini editar datos
        editarButton.addEventListener("click", (e) => {
            const produNameAnterior = productNameInput.value;
            if (produNameAnterior.trim() !== "") {
                saveButton.style.display = 'block';
                editarButton.style.display = 'none';
            } else {
                console.log("Digite Nombre Producto");
            }
        });
        // fin editar datos

        // ini grabar datos
        saveButton.addEventListener("click", (e) => {
            const productName = productNameInput.value;
            if (productName.trim() !== "") {
                const db = getDatabase();
                const dbf = ref(db, 'productos/producto:' + produNameAnterior);
                onValue(dbf, (snapshot) => {
                    let data = snapshot.val();
                    if (data !== null) {
                        const path = 'productos/producto:' + productName;
                        // Luego, puedes usar 'path' en tu función set
                        set(ref(db, path), {nombre: productName});
                    }
                });
            } else {
                console.log("Digite Nombre Producto");
            }
        });
        // fin grabar dstos

        // ini nuevo datos
        nuevoButton.addEventListener("click", (e) => {
            editarButton.style.display = 'none';
            saveButton.style.display = 'none';
            eliminarButton.style.display = 'none';
            document.getElementById('idproducname').innerText = "Nombre Producto : ";
            productNameInput.value = "";
            productNameInput.focus();
        });
        // fin nuevo datos

        // INI LISTAR PRODUCTOS
        const db = getDatabase();
        const productRef = ref(db, 'productos'); // Referencia al nodo 'productos'

        const productList = document.getElementById('product-list');
        const productDetail = document.getElementById('product-detail');
        const detailImage = document.getElementById('detail-image');
        const detailName = document.getElementById('detail-name');
        const detailDescription = document.getElementById('detail-description');
        const detailPrice = document.getElementById('detail-price');
        const closeDetailButton = document.getElementById('close-detail');

        onValue(productRef, (snapshot) => {
            productList.innerHTML = ''; // Limpia la lista antes de actualizarla

            const products = snapshot.val();

            if (products) {
                Object.keys(products).forEach(productId => {
                    const product = products[productId];
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item'); // Clase de Bootstrap
                    listItem.textContent = product.nombre; // Muestra el nombre del producto
                    productList.appendChild(listItem);
                    listItem.setAttribute('data-id', productId);
                    // Añade el ID como atributo

                    // Agrega el evento click
                    listItem.addEventListener('click', () => {
                        productNameInput.value = product.nombre;
                        // productNameInput.focus();
                        // alert(`Nombre del producto: ${product.nombre}`);

                        // ---
                        // INI LISTAR DATOS NEW
                        const detailRef = ref(db, `detalleproductos/${productId}`);
                        onValue(detailRef, (detailSnapshot) => {
                            const detail = detailSnapshot.val();
                            if (detail) {
                                detailImage.src = detail.imagen;
                                detailName.textContent = product.nombre;
                                detailDescription.textContent = detail.descripcion;
                                detailPrice.textContent = `Precio: $${detail.precio}`;
                                productDetail.style.display = 'block'; // Muestra el detalle
                            } else {
                                alert('Detalle del producto no encontrado.');
                            }
                        });
                        // FIN VER DETALLE PRODUCTO
                        
                    });
                });
            } else {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.textContent = "No hay productos registrados.";
                productList.appendChild(listItem);
            }
        });
        // FIN LISTAR PRODUCTOS


    } else {
        console.log("No hay usuario autenticado")
    }

});
// FIN CRUD
