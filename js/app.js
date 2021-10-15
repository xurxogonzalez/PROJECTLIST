"use strict";
/**
 * Conceptos
    DOMContentLoaded
    new Date()
    createAttribute()
    setAttributeNode()
    appendChild()
    filter()
    map()
 */
/**
 * Captura de nodos
 */
const formElement = document.querySelector('.form-container');
const inputEl = document.getElementById("input");
const btnInput = document.querySelector(".btn-input");
const itemsContainer = document.querySelector(".items-container");
const listEl = document.querySelector(".list-container");
const clearItems = document.querySelector(".clear-items");
const alert = document.querySelector(".alert");

let editEl = null; //almacenamos el nodo (li) que vams a editar
let editFlag = false;

/**
 * Funciones
 */
/**
 * Función que permite formatear mensajes
 * @param {String} text Texto del mensaje
 * @param {String} className Nombre de la clase
 */
const alertMsg = (text, className) => {
    alert.innerHTML = text;
    alert.classList.add(className);
    setTimeout(
        () => {
            alert.innerHTML = '';
            alert.classList.remove(className);
        },
        1500
    );

}

/**
 * Ponemos por defecto el control de entrada de datos vacío
 */
const setBackToDefault = () => {
    inputEl.value = '';
    inputEl.focus();
    btnInput.textContent = 'Enviar';
    editFlag = false;
}

const createNode = (value, key) => {
    const el = document.createElement("li");
    //Creamos un id a partir de la fecha del sistema
    const id = key;
    //Creamos atributo de tipo dataset
    const attr = document.createAttribute("data-id");
    attr.value = id;
    el.setAttributeNode(attr);
    //Añadimos nombre de clase
    el.classList.add("list-item");
    //Insertamos contenido
    el.innerHTML = `
            <span class="item">
                ${value}
            </span>
            <div class="btn-container">
                <button class="btn btn-edit">
                    <span title="Editar" class="fa fa-edit"></span>
                </button>
                <button class="btn btn-trash">
                    <span title="Eliminar" class="fa fa-trash"></span>
                </button>
            </div>
    `;
    listEl.appendChild(el);
}
/**
 * Función que inserta los datos en la lista
 */
const insertData = (value, key) => {
    createNode(value, key);
    itemsContainer.classList.add("show-items-container");
    alertMsg(`<mark>${value}</mark> añadido a la lista`, "success");
    addToLocalStorage(value, key);
    setBackToDefault();
}

/**
 * 
 * @param {Object Event} e evento que ocasiona la entrada de datos en el formulario
 */
const inputData = e => {
    e.preventDefault();
    if (inputEl.value.length && !editFlag) {
        insertData(inputEl.value.trim(), new Date().getTime());
    } else if (inputEl.value.length && editFlag) {
        if (editEl) {
            editEl.textContent = inputEl.value.trim();
            alertMsg("Cambios realizados", "success");
            //console.log(editEl)
            editToLocalStorage(inputEl.value.trim(), editEl.parentElement.dataset.id);
            setBackToDefault();

        }
    }
}

const clearAllItems = e => {
    if (e)
        e.preventDefault();
    let items = document.querySelectorAll('.list-item');
    if (items) {
        items.forEach(
            item => {
                listEl.removeChild(item);
            }
        );
        itemsContainer.classList.remove("show-items-container");
    }
    alertMsg("Lista vacía", "error");
    setBackToDefault();
    localStorage.removeItem('dataProjectList');
}

/**
 * 
 * @param {Element <li>} item Elemento para editar
 */
const editItem = (item) => {
    btnInput.textContent = 'Editar';
    const spanEl = item.firstElementChild;
    inputEl.value = spanEl.textContent.trim();
    editEl = spanEl;
    editFlag = true;
}

/**
 * 
 * @param {Element <li>} item Elemento para eliminarlo
 */

const deleteItem = (item) => {
    listEl.removeChild(item);
    if (!listEl.children.length)
        clearAllItems();
    removeFromLocalStorage(item.dataset.id);
}


//Local Storage
/**
 * 
 * @param {String} value Valor del item a almacenar
 * @param {String} id Identificador del item a almacenar
 */
const addToLocalStorage = (value, id) => {
    // const item = {
    //     id: id,
    //     value: value
    // }//Si el nombre del campo coincide con el valor podemos simplificar como lo siguiente...
    id = id.toString();//para que nos llegue en formato String
    const item = { id, value };
    const items = getLocalStorage();
    items.push(item);
    //console.log(items)
    window.localStorage.setItem('dataProjectList', JSON.stringify(items));

}
/**
 * 
 * @returns {Array} Array de objetos del localStorage o un array vacío
 */
const getLocalStorage = () => localStorage.getItem("dataProjectList") ? JSON.parse(localStorage.getItem("dataProjectList")) : [];
/**
 * 
 * @param {String} value Valor del item a almacenar
 * @param {String} id Identificador del item a almacenar
 */
const editToLocalStorage = (value, id) => {
    /**
     * localStorage
     * setItem
     */
    let items = getLocalStorage();
    if (items.length) {
        items = items.map(
            item => {
                //console.log(`${item.id}-${id}`)
                if (item.id === id)
                    item.value = value;
                return item;
            }
        );
        //console.log(items)
        window.localStorage.setItem('dataProjectList', JSON.stringify(items));
    }
}
/**
 * Eliminamos el registro del local storage
 * @param {Number} id 
 */
const removeFromLocalStorage = id => {
    let items = getLocalStorage();
    if (items.length) {
        items = items.filter(
            item => {
                //console.log(`${item.id}-${id}`)
                if (item.id !== id)
                    return item;
            }
        );
        //console.log(items)
        window.localStorage.setItem('dataProjectList', JSON.stringify(items));
    }
}


/**
 * Lanzamos el formulario donde se insertan nuevos items
 */
formElement.addEventListener(
    'submit',
    inputData
);

clearItems.addEventListener(
    "click",
    clearAllItems
);

listEl.addEventListener(
    "click",
    e => {
        if (e.target.classList.contains("fa-edit")) {
            editItem(e.target.parentElement.parentElement.parentElement);
        }
        if (e.target.classList.contains("fa-trash")) {
            deleteItem(e.target.parentElement.parentElement.parentElement);
        }
    }
);

window.addEventListener(
    "load",
    () => {
        const items = localStorage.getItem("dataProjectList") ? JSON.parse(localStorage.getItem("dataProjectList")) : null;
        if (items) {
            items.forEach(
                item => {
                    createNode(item.value, item.id);
                }
            );
            itemsContainer.classList.add("show-items-container");
        }
    }
);