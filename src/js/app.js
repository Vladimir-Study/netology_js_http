import Ticket from './ticket/ticket';

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
  created: date,
};

async function getRequest(path, method, body = null) {
  const response = await fetch(url + path, {
    method,
    body,
  });
  const result = await response.json();
  return {
    result,
    status: response.status,
  };
}

async function showAllTickets() {
  const getAllTickets = await getRequest('?method=allTickets', 'GET');

  getAllTickets.result.forEach((element) => {
    tickets.addTicket(element.id, element.status, element.name, element.created);
  });

  showDescription();
  closeTicket();
  editTicket();
}

function closeTicket() {
  const closeIconTickets = document.querySelectorAll('.close-icon');

  closeIconTickets.forEach((elems) => {
    const elem = elems;
    elem.style = 'cursor:pointer';
    elem.addEventListener('click', async (event) => {
      const ticketId = event.target.parentNode.parentNode.getAttribute('id');
      await getRequest(`?method=delete&id=${ticketId}`, 'DELETE');
      allTickets = document.querySelectorAll('.ticket');
      allTickets.forEach((board) => {
        boardTicket.removeChild(board);
      });
      await showAllTickets();
    });
  });
}

function editTicket() {
  const editIconTicket = document.querySelectorAll('.edit-icon');

  editIconTicket.forEach((elem) => {
    elem.style.cursor = 'pointer';
    elem.addEventListener('click', async (event) => {
      const ticketId = event.target.parentNode.parentNode.getAttribute('id');
      editTicketBlock.classList.remove('on-show');
      const ticket = await getRequest(`?method=ticketById&id=${ticketId}`, 'GET');
      editedTicket = ticket.result[0];
      const currentEditTicket = editTicketBlock.childNodes[1];
      currentEditTicket.childNodes[5].value = editedTicket.name;
      currentEditTicket.childNodes[9].value = editedTicket.description;
      editedTicket.status = event.target.parentNode.parentNode.childNodes[0].checked;
    });
  });
}

editFormBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  editedTicket.name = event.target.parentNode.childNodes[5].value;
  editedTicket.description = event.target.parentNode.childNodes[9].value;
  const sendBody = JSON.stringify(editedTicket);
  const response = await getRequest('?method=editTicket', 'PUT', sendBody);
  if (response.status === 200) {
    event.target.parentNode.parentNode.classList.add('on-show');
    allTickets = document.querySelectorAll('.ticket');
    allTickets.forEach((elem) => {
      boardTicket.removeChild(elem);
    });
    await showAllTickets();
  }
});

function showDescription() {
  allTickets = document.querySelectorAll('.ticket');

  allTickets.forEach((elem) => {
    const shortDescription = elem.childNodes[1].childNodes[0];
    shortDescription.style = 'cursor:pointer';

    shortDescription.addEventListener('click', async () => {
      if (shortDescription.parentNode.childNodes.length <= 1) {
        const ticketId = elem.getAttribute('id');
        const fullDescription = await getRequest(`?method=ticketById&id=${ticketId}`, 'GET');
        tickets.addFullDescription(
          shortDescription.parentNode,
          fullDescription.result[0].description,
        );
      }
    });
  });
}

showAllTickets();

addTicketForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  let body = Array.from(addTicketForm).filter(({ name }) => name)
    .map(({ name, value }) => {
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
    tickets.addTicket(
      lastAddTicket.result.at(-1).id,
      lastAddTicket.result.at(-1).status,
      lastAddTicket.result.at(-1).name,
      lastAddTicket.result.at(-1).created,
    );
    allTickets = document.querySelectorAll('.ticket');
    allTickets.forEach((elem) => {
      boardTicket.removeChild(elem);
    });
    await showAllTickets();
  }
});

addTicketBtn.addEventListener('click', () => {
  addTicketBlock.classList.remove('on-show');
});

closeFormIcon.forEach((elem) => {
  elem.addEventListener('click', (event) => {
    const closeWindow = event.target.parentNode.parentNode;
    closeWindow.classList.add('on-show');
  });
});
