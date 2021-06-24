<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <input class="new-todo" autocomplete="off" placeholder="Todo List" @keyup.enter="addTodo" />
    </header>
    <!-- main section -->
    <section v-show="todos.length" class="main">
      <input
        id="toggle-all"
        :checked="allChecked"
        class="toggle-all"
        type="checkbox"
        @change="toggleAll({ done: !allChecked })"
      />
      <label for="toggle-all" />
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
          @toggleTodo="toggleTodo"
          @editTodo="editTodo"
          @deleteTodo="deleteTodo"
        />
      </ul>
    </section>
    <!-- footer -->
    <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ pluralize(remaining, 'item') }} left
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{
            capitalize(key)
          }}</a>
        </li>
      </ul>
      <button class="clear-completed" v-show="todos.length > remaining" @click="clearCompleted">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import Todo from './Todo.vue'

const STORAGE_KEY = 'todos'
const defalutList = [
  { text: 'star this repository', done: false },
  { text: 'fork this repository', done: false },
  { text: 'follow author', done: false },
  { text: 'vue-element-admin', done: true },
  { text: 'vue', done: true },
  { text: 'element-ui', done: true },
  { text: 'axios', done: true },
  { text: 'webpack', done: true }
]
const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.done),
  completed: (todos) => todos.filter((todo) => todo.done)
}
export default {
  components: { Todo },
  setup() {
    const state = reactive({
      visibility: 'all',
      filters,
      // todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || defalutList
      todos: defalutList
    })
    const allChecked = computed(() => {
      return state.todos.every((todo) => todo.done)
    })
    const filteredTodos = computed(() => {
      return filters[state.visibility](state.todos)
    })
    const remaining = computed(() => {
      return state.todos.filter((todo) => !todo.done).length
    })
    const pluralize = (n, w) => (n === 1 ? w : `${w}s`)
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
    const setLocalStorage = () => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
    }
    const addTodo = (e) => {
      const text = e.target.value
      if (text.trim()) {
        state.todos.push({
          text,
          done: false
        })
        setLocalStorage()
      }
      e.target.value = ''
    }
    const toggleTodo = (val) => {
      // eslint-disable-next-line no-param-reassign
      val.done = !val.done
      setLocalStorage()
    }
    const deleteTodo = (todo) => {
      state.todos.splice(state.todos.indexOf(todo), 1)
      setLocalStorage()
    }
    const editTodo = ({ todo, value }) => {
      // eslint-disable-next-line no-param-reassign
      todo.text = value
      setLocalStorage()
    }
    const clearCompleted = () => {
      state.todos = state.todos.filter((todo) => !todo.done)
      setLocalStorage()
    }
    const toggleAll = ({ done }) => {
      state.todos.forEach((todo) => {
        // eslint-disable-next-line no-param-reassign
        todo.done = done
        setLocalStorage()
      })
    }
    return {
      ...toRefs(state),
      allChecked,
      filteredTodos,
      remaining,
      pluralize,
      capitalize,
      setLocalStorage,
      addTodo,
      toggleTodo,
      deleteTodo,
      editTodo,
      clearCompleted,
      toggleAll
    }
  }
}
</script>

<style lang="scss" scoped>
.todoapp {
  font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.4em;
  color: #4d4d4d;
  min-width: 230px;
  max-width: 550px;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 300;
  background: #fff;
  z-index: 1;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);

  button {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    font-size: 100%;
    vertical-align: baseline;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :focus {
    outline: 0;
  }
  .hidden {
    display: none;
  }

  input::input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }

  h1 {
    position: absolute;
    top: -155px;
    width: 100%;
    font-size: 100px;
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.15);
    text-rendering: optimizeLegibility;
  }

  .new-todo,
  .edit {
    position: relative;
    margin: 0;
    width: 100%;
    font-size: 18px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    border: 0;
    color: inherit;
    padding: 6px;
    border: 1px solid #999;
    box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .new-todo {
    padding: 10px 16px 16px 60px;
    border: none;
    background: rgba(0, 0, 0, 0.003);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  }

  .main {
    position: relative;
    z-index: 2;
    border-top: 1px solid #e6e6e6;
  }

  .toggle-all {
    text-align: center;
    border: none;
    /* Mobile Safari */
    opacity: 0;
    position: absolute;

    & + label {
      width: 60px;
      height: 34px;
      font-size: 0;
      position: absolute;
      top: -52px;
      left: -13px;
      transform: rotate(90deg);

      &:before {
        content: '❯';
        font-size: 22px;
        color: #e6e6e6;
        padding: 10px 27px 10px 27px;
      }
    }

    &:checked + label:before {
      color: #737373;
    }
  }

  .todo-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .footer {
    color: #777;
    position: relative;
    padding: 10px 15px;
    height: 40px;
    text-align: center;
    border-top: 1px solid #e6e6e6;

    &:before {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 40px;
      overflow: hidden;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
        0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
    }

    .todo-count {
      float: left;
      text-align: left;

      strong {
        font-weight: 300;
      }
    }

    .filters {
      margin: 0;
      padding: 0;
      position: relative;
      z-index: 1;
      list-style: none;
      li {
        display: inline;

        a {
          color: inherit;
          font-size: 12px;
          padding: 3px 7px;
          text-decoration: none;
          border: 1px solid transparent;
          border-radius: 3px;

          &:hover {
            border-color: rgba(175, 47, 47, 0.1);
          }

          &.selected {
            border-color: rgba(175, 47, 47, 0.2);
          }
        }
      }
    }

    .clear-completed {
      &:active {
        float: right;
        position: relative;
        line-height: 20px;
        text-decoration: none;
        cursor: pointer;
      }

      &:hover {
        text-decoration: underline;
      }
    }

    .info {
      margin: 65px auto 0;
      color: #bfbfbf;
      font-size: 10px;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
      text-align: center;
      p {
        line-height: 1;
      }
      a {
        color: inherit;
        text-decoration: none;
        font-weight: 400;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  /*
  Hack to remove background from Mobile Safari.
  Can't use it globally since it destroys checkboxes in Firefox
*/
  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    .toggle-all,
    .todo-list li .toggle {
      background: none;
    }
    .todo-list li .toggle {
      height: 40px;
    }
  }
  @media (max-width: 430px) {
    .footer {
      height: 50px;
    }
    .filters {
      bottom: 10px;
    }
  }
}
</style>
