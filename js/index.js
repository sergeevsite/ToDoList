'use strict';

// Основные переменные
const todoControl = document.querySelector('.todo-control'),
      headerInput = document.querySelector('.header-input'),
      todoList = document.querySelector('.todo-list'),
      todoCompleted = document.querySelector('.todo-completed');

// Массив данных из задач
const todoData = (localStorage.tasks) ? JSON.parse(localStorage.getItem('tasks')) : [];

// Формирование списка задач
const render = function() {

  // Чистка перед обновлением списка
  todoList.textContent = '';
  todoCompleted.textContent = '';

  // Перебор массива с данными задачи
  todoData.forEach(function(item, i) {

    // Создание верстки под новую задачу
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.innerHTML = '<span class="text-todo">' + item.value + '</span>' +
                  '<div class="todo-buttons">' +
                    '<button class="todo-remove"></button>' +
                    '<button class="todo-complete"></button>' +
                  '</div>';

    // Добавление задачи в верстку
    (item.completed) ? todoCompleted.append(li) : todoList.append(li);
    
    // Кнопка для отметки задачи
    const buttonTodoCompleted = li.querySelector('.todo-complete');

    buttonTodoCompleted.addEventListener('click', function() {
      item.completed = !item.completed;
      localStorage.setItem('tasks', JSON.stringify(todoData));
      render();
    });

    // Кнопка удаление задачи
    const buttonTodoRemove = li.querySelector('.todo-remove');

    buttonTodoRemove.addEventListener('click', function() {
      li.remove();
      todoData.splice(i, 1);
      localStorage.setItem('tasks', JSON.stringify(todoData));
      render();
    });

  });
};


// Добавление задач в список
todoControl.addEventListener('submit', function(event) {
  event.preventDefault();

  // Проверка на пустое поле
  if(headerInput.value !== '' && headerInput.value.trim() !== '') {
    // Добавление новой задачи в массив
    const newTask = {
      value: headerInput.value,
      completed: false
    };
    todoData.push(newTask);
  
    //Запись в LocalStorage
    localStorage.setItem('tasks', JSON.stringify(todoData));
  }

  // Чистка поля ввода
  headerInput.value = '';

  render();
});

// Подгрузка с LocalStorage
render();