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
      <!-- <button class="clear-completed" v-show="todos.length > remaining" @click="clearCompleted">
        Clear completed
      </button> -->
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
// TODO: UI调整
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
@import './index.scss';
</style>
