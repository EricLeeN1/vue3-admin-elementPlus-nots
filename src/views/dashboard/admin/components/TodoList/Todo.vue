<template>
  <li :class="{ completed: todo.done, editing: editing }" class="todo">
    <div class="view">
      <input :checked="todo.done" class="toggle" type="checkbox" @change="toggleTodo(todo)" />
      <label @dblclick="editing = true" v-text="todo.text" />
      <button class="destroy" @click="deleteTodo(todo)" />
    </div>
    <input
      v-show="editing"
      v-focus="editing"
      :value="todo.text"
      class="edit"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      @blur="doneEdit"
    />
  </li>
</template>

<script>
import { toRefs, reactive } from 'vue'

export default {
  name: 'Todo',
  props: {
    todo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  directives: {
    focus(el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          el.focus()
        })
      }
    }
  },
  emit: ['deleteTodo', 'editTodo', 'toggleTodo'],
  setup(props, ctx) {
    const state = reactive({
      editing: false
    })
    const deleteTodo = (todo) => {
      ctx.emit('deleteTodo', todo)
    }
    const editTodo = ({ todo, value }) => {
      ctx.emit('editTodo', { todo, value })
    }
    const toggleTodo = (todo) => {
      ctx.emit('toggleTodo', todo)
    }
    const cancelEdit = (e) => {
      e.target.value = props.todo.text
      state.editing = false
    }
    const doneEdit = (e) => {
      const value = e.target.value.trim()
      const { todo } = props
      if (!value) {
        deleteTodo({
          todo
        })
      } else if (state.editing) {
        editTodo({
          todo,
          value
        })
        state.editing = false
      }
    }
    return {
      ...toRefs(state),
      deleteTodo,
      editTodo,
      toggleTodo,
      cancelEdit,
      doneEdit
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  position: relative;
  font-size: 24px;
  border-bottom: 1px solid #ededed;
  :last-child {
    border-bottom: none;
  }

  &.editing {
    border-bottom: none;
    padding: 0;
    &:last-child {
      margin-bottom: -1px;
    }
    .edit {
      display: block;
      width: 506px;
      padding: 12px 16px;
      margin: 0 0 0 43px;
    }
    .view {
      display: none;
    }
  }

  .toggle {
    text-align: center;
    width: 40px;
    /* auto, since non-WebKit browsers doesn't support input styling */
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    border: none;
    appearance: none;
    opacity: 0;

    & + label {
      /*
    Firefox requires `#` to be escaped - https://bugzilla.mozilla.org/show_bug.cgi?id=922433
    IE and Edge requires *everything* to be escaped to render, so we do that instead of just the `#` - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7157459/
  */
      background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
      background-repeat: no-repeat;
      background-position: center left;
      background-size: 36px;
    }

    &:checked + label {
      background-size: 36px;
      background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E');
    }
  }

  label {
    word-break: break-all;
    padding: 15px 15px 15px 50px;
    display: block;
    line-height: 1;
    font-size: 14px;
    transition: color 0.4s;
  }

  &.completed label {
    color: #d9d9d9;
    text-decoration: line-through;
  }

  .destroy {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    padding: 0;
    width: 30px;
    height: 30px;
    margin: auto 0;
    font-size: 20px;
    border: none;
    color: #cc9a9a;
    transition: color 0.2s ease-out;
    cursor: pointer;

    &:hover {
      color: #af5b5e;
    }
    &:after {
      content: '×';
    }
  }

  &:hover .destroy {
    display: block;
  }

  .edit {
    display: none;
  }
}
</style>
