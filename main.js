/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 892:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

;// CONCATENATED MODULE: ./src/js/ticket/ticket.js
class Ticket {
  constructor(parentElement) {
    this.parentElement = parentElement;
  }
  addTicket(id, status, name, created) {
    const ticketElem = document.createElement('div');
    ticketElem.id = id;
    ticketElem.classList.add('ticket');
    this.parentElement.append(ticketElem);
    const statusElem = document.createElement('input');
    statusElem.type = 'checkbox';
    if (status === true) {
      statusElem.checked = true;
    }
    statusElem.classList.add('ticket-status');
    ticketElem.append(statusElem);
    const ticketDescriptionElem = document.createElement('div');
    ticketDescriptionElem.classList.add('ticket-description');
    ticketElem.append(ticketDescriptionElem);
    const shortDescriptionElem = document.createElement('div');
    shortDescriptionElem.classList.add('ticket-short-description');
    shortDescriptionElem.textContent = name;
    ticketDescriptionElem.append(shortDescriptionElem);
    const createDateElem = document.createElement('span');
    createDateElem.classList.add('ticket-create-date');
    const dateCreate = new Date(created);
    createDateElem.textContent = `${dateCreate.getDate()}.${dateCreate.getMonth() + 1}.${dateCreate.getFullYear()} ${dateCreate.getHours()}:${dateCreate.getMinutes()}`;
    ticketElem.append(createDateElem);
    const iconsElem = document.createElement('div');
    iconsElem.classList.add('edit-ticket-icon');
    ticketElem.append(iconsElem);
    const editIconElem = document.createElement('div');
    editIconElem.classList.add('edit-icon');
    iconsElem.append(editIconElem);
    const closeIconElem = document.createElement('div');
    closeIconElem.classList.add('close-icon');
    iconsElem.append(closeIconElem);
  }
  addFullDescription(parentElem, description) {
    const fullDescriptionElem = document.createElement('div');
    fullDescriptionElem.classList.add('ticket-full-description');
    fullDescriptionElem.textContent = description;
    parentElem.append(fullDescriptionElem);
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

const boardTicket = document.querySelector('.all-tickets');
const addTicketBlock = document.querySelector('.add-ticket');
const editTicketBlock = document.querySelector('.edit-ticket');
const addTicketForm = addTicketBlock.querySelector('.add-ticket-form');
const editFormBtn = document.querySelector('.form-btn-edit');
const addTicketBtn = document.querySelector('.add-ticket-btn');
const closeFormIcon = document.querySelectorAll('.close-form-icon');
let allTickets;
const date = Date.now();
const url = 'http://localhost:7887/';
let editedTicket;
const tickets = new Ticket(boardTicket);
const ticketData = {
  id: null,
  name: null,
  description: null,
  status: false,
  created: date
};
async function getRequest(path, method, body = null) {
  const response = await fetch(url + path, {
    method,
    body
  });
  const result = await response.json();
  return {
    result,
    status: response.status
  };
}
async function updateCurrentStatus() {
  const allTicketsStatus = document.querySelectorAll('.ticket-status');
  allTicketsStatus.forEach(elem => {
    elem.addEventListener('click', async () => {
      const currentStatus = elem.checked;
      const currentTicket = elem.parentNode;
      const ticketId = currentTicket.getAttribute('id');
      ticketData.id = ticketId;
      ticketData.status = currentStatus;
      const sendBody = JSON.stringify(ticketData);
      await getRequest('?method=editStatus', 'PUT', sendBody);
    });
  });
}
async function showAllTickets() {
  const getAllTickets = await getRequest('?method=allTickets', 'GET');
  getAllTickets.result.forEach(element => {
    tickets.addTicket(element.id, element.status, element.name, element.created);
  });
  showDescription();
  closeTicket();
  editTicket();
  updateCurrentStatus();
}
function closeTicket() {
  const closeIconTickets = document.querySelectorAll('.close-icon');
  closeIconTickets.forEach(elems => {
    const elem = elems;
    elem.style = 'cursor:pointer';
    elem.addEventListener('click', async event => {
      const ticketId = event.target.parentNode.parentNode.getAttribute('id');
      await getRequest(`?method=delete&id=${ticketId}`, 'DELETE');
      allTickets = document.querySelectorAll('.ticket');
      allTickets.forEach(board => {
        boardTicket.removeChild(board);
      });
      await showAllTickets();
    });
  });
}
function editTicket() {
  const editIconTicket = document.querySelectorAll('.edit-icon');
  editIconTicket.forEach(elem => {
    elem.style.cursor = 'pointer';
    elem.addEventListener('click', async event => {
      const ticketId = event.target.parentNode.parentNode.getAttribute('id');
      editTicketBlock.classList.remove('on-show');
      const ticket = await getRequest(`?method=ticketById&id=${ticketId}`, 'GET');
      editedTicket = ticket.result[0];
      const currentEditTicket = editTicketBlock.querySelector('.add-ticket-form');
      currentEditTicket.querySelector('.short-description-form').value = editedTicket.name;
      currentEditTicket.querySelector('.full-description-form').value = editedTicket.description;
      editedTicket.status = event.target.parentNode.parentNode.childNodes[0].checked;
    });
  });
}
editFormBtn.addEventListener('click', async event => {
  event.preventDefault();
  editedTicket.name = event.target.parentNode.querySelector('.short-description-form').value;
  editedTicket.description = event.target.parentNode.querySelector('.full-description-form').value;
  const sendBody = JSON.stringify(editedTicket);
  const response = await getRequest('?method=editTicket', 'PUT', sendBody);
  if (response.status === 200) {
    event.target.parentNode.parentNode.classList.add('on-show');
    allTickets = document.querySelectorAll('.ticket');
    allTickets.forEach(elem => {
      boardTicket.removeChild(elem);
    });
    await showAllTickets();
  }
});
function showDescription() {
  allTickets = document.querySelectorAll('.ticket');
  allTickets.forEach(elem => {
    const shortDescription = elem.querySelector('.ticket-short-description');
    shortDescription.style = 'cursor:pointer';
    shortDescription.addEventListener('click', async () => {
      if (shortDescription.parentNode.childNodes.length <= 1) {
        const ticketId = elem.getAttribute('id');
        const fullDescription = await getRequest(`?method=ticketById&id=${ticketId}`, 'GET');
        tickets.addFullDescription(shortDescription.parentNode, fullDescription.result[0].description);
      }
    });
  });
}
showAllTickets();
addTicketForm.addEventListener('submit', async event => {
  event.preventDefault();
  let body = Array.from(addTicketForm).filter(({
    name
  }) => name).map(({
    name,
    value
  }) => {
    for (const key in ticketData) {
      if (key === name) {
        ticketData[key] = value;
      }
    }
    return addTicketForm;
  });
  body = JSON.stringify(ticketData);
  const response = await getRequest('?method=createTicket', 'POST', body);
  if (response.status === 200) {
    addTicketBlock.classList.add('on-show');
    const lastAddTicket = await getRequest('?method=allTickets', 'GET');
    tickets.addTicket(lastAddTicket.result.at(-1).id, lastAddTicket.result.at(-1).status, lastAddTicket.result.at(-1).name, lastAddTicket.result.at(-1).created);
    allTickets = document.querySelectorAll('.ticket');
    allTickets.forEach(elem => {
      boardTicket.removeChild(elem);
    });
    await showAllTickets();
  }
});
addTicketBtn.addEventListener('click', () => {
  addTicketBlock.classList.remove('on-show');
});
closeFormIcon.forEach(elem => {
  elem.addEventListener('click', event => {
    const closeWindow = event.target.parentNode.parentNode;
    closeWindow.classList.add('on-show');
  });
});

/***/ }),

/***/ 177:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__(177);
__webpack_require__(892);
})();

/******/ })()
;