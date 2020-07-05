'use strict';

class Todo {

  constructor(form, input, todoContainer, todoList, todoComleted) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoContainer = document.querySelector(todoContainer);
    this.todoList = document.querySelector(todoList);
    this.todoComleted = document.querySelector(todoComleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem('list')));
  }

  // Отправка в LocalStorage
  addToStorage() {
    localStorage.setItem('list', JSON.stringify([...this.todoData]));
  }

  // Отрисовка
  render() {
    this.todoList.textContent = '';
    this.todoComleted.textContent = '';
    this.todoData.forEach(this.createItem);
    this.addToStorage();
  }

  // Создание задачи
  createItem = (todo) => {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = todo.key;
    li.insertAdjacentHTML('beforeend', `
      <span class="text-todo">${todo.value}</span>
      <div class="todo-buttons">
        <button class="todo-edit"></button>
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
    `);

    if(todo.completed) {
      this.todoComleted.append(li)
    } else {
      this.todoList.append(li);
    }

  }

  // Добавление задачи
  addTodo(e) {
    e.preventDefault();

    if(this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.render();
      this.error();
    } else {
      this.error();
    }
    this.input.value = '';
    
  }
  
  // Ошибка ввода
  error() {
    if(this.input.value) {
      if(this.input.nextElementSibling !== null) {
        this.input.nextElementSibling.remove();
      }
    } else {
      if(this.input.nextElementSibling === null) {
        let span = document.createElement('span');
        span.classList.add('error');
        span.textContent = 'Поле не может быть пустым';
        this.input.after(span);
      }
    }
  }

  // Генерация уникального ключа
  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  // Удалить задачу
  deleteItem(item) {
    let li = item.closest('li');
    
    // Анимация удаления
    let frame = 100,
        speed = 6;

    const animated = () => {
      frame -= speed;
      li.style.width = `${frame}%`;
      li.style.opacity = `${frame}%`;
      li.style.transform = `translateX(${frame - 100}%)`;
      if(frame > 20) {
        requestAnimationFrame(animated);
      } else {
        this.todoData.forEach((task) => {
          if(li.key === task.key) {
            this.todoData.delete(task.key);
          }
        });
        this.render();
      }
    };
    requestAnimationFrame(animated);
  }

  // Смена статуса задачи
  completedItem(item) {
    let li = item.closest('li');

    // Анимация смены статуса
    let frame = 100,
        speed = 5;

    const animated = () => {
      frame -= speed;
      li.style.opacity = `${frame}%`;
      if(frame > 0) {
        requestAnimationFrame(animated);
      } else {
        this.todoData.forEach((task) => {
          if(li.key === task.key) {
            task.completed = !task.completed;
          }
        });
        this.render();
      }
    };
    requestAnimationFrame(animated);
    
  }

  editItem(item) {
    let li = item.closest('li');
    let text = li.children[0];
    let input = document.createElement('input');
    input.value = text.textContent;
    text.after(input);
    input.focus();
    text.style.display = 'none';
    input.addEventListener('blur', () => {
      input.remove();
      text.style.display = 'block';
      this.todoData.forEach((task) => {
        if(li.key === task.key) {
          task.value = input.value;
        }
      });
      this.render();
    });
  }

  // Делегирование
  handler() {
    this.todoContainer.addEventListener('click', (e) => {
      let target = e.target;
      if(target.classList.contains('todo-remove')) {
        this.deleteItem(target);
      }
      if(target.classList.contains('todo-complete')) {
        this.completedItem(target);
      }
      if(target.classList.contains('todo-edit')) {
        this.editItem(target);
      }
    });
  }

  // Отправка задач
  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.render();
    this.handler();
  }

}

const todo = new Todo('.todo-control', '.header-input', '.todo-container', '.todo-list', '.todo-completed');

todo.init();