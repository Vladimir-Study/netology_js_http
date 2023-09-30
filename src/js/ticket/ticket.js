export default class Ticket {
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
    createDateElem.textContent = `${dateCreate.getDate()}.${(dateCreate.getMonth() + 1)}.${dateCreate.getFullYear()} ${dateCreate.getHours()}:${dateCreate.getMinutes()}`;
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
