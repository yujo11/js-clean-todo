import TodoList from './components/TodoList';
import Model from './model/Model';
import { $ } from './utils/querySelector';
import { isEmptyString } from './utils/validator';

const initialState = [
  {
    id: 123,
    text: 'temp1',
  },
  {
    id: 456,
    text: 'temp2',
  },
];

const todoApp = () => {
  const $todoList = $('.todo-list');
  const $newTodo = $('.new-todo');

  const model = Model({
    observable: [],
    renderer: () => {
      $todoList.innerHTML = TodoList(model.todo);
    },
  });

  const addTodo = ({ key, target }) => {
    if (key !== 'Enter') return;

    if (isEmptyString(target.value)) return;

    model.todo = [
      ...model.todo,
      {
        id: Date.now(),
        text: target.value,
      },
    ];

    target.value = '';
  };

  const deleteTodo = ({ target }) => {
    if (!target.classList.contains('destroy')) return;

    model.todo = model.todo.filter((item) => item.id !== +target.id);
  };

  const patchTodo = ({ target, key }) => {
    const targetItem = target.closest('li');

    if (!targetItem.classList.contains('editing')) return;

    if (key === 'Enter') {
      targetItem.classList.remove('editing');
      model.todo = model.todo.map((item) => {
        if (item.id === +targetItem.id) {
          item.text = target.value;
        }

        return item;
      });
    }

    if (key === 'Escape') {
      targetItem.classList.remove('editing');

      model.todo = [...model.todo];
    }
  };

  const updateTodo = ({ target }) => {
    if (!target.classList.contains('label')) return;

    target.closest('li').classList.add('editing');
  };

  return {
    init: () => {
      model.todo = initialState;

      $newTodo.addEventListener('keyup', addTodo);
      $todoList.addEventListener('click', deleteTodo);
      $todoList.addEventListener('dblclick', updateTodo);
      $todoList.addEventListener('keyup', patchTodo);
    },
  };
};

export default todoApp;
