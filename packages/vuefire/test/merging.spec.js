import Vuefire from '../src'
import { db, Vue } from '@posva/vuefire-test-helpers'

Vue.use(Vuefire)

let mWithObjA, mWithObjB, mWithFn
beforeEach(async () => {
  mWithObjA = {
    firestore: {
      a: db.collection(1),
      b: db.collection(2)
    }
  }

  mWithObjB = {
    firestore: {
      a: db.collection(3),
      c: db.collection(4)
    }
  }

  mWithFn = {
    firestore () {
      return {
        a: db.collection(5),
        c: db.collection(6)
      }
    }
  }
})

test('should merge properties', () => {
  const vm = new Vue({
    mixins: [mWithObjA, mWithObjB]
  })
  expect(vm.$firestoreRefs).toEqual({
    a: db.collection(3),
    b: db.collection(2),
    c: db.collection(4)
  })
})

test('supports function syntax', () => {
  const vm = new Vue({
    mixins: [mWithFn]
  })
  expect(vm.$firestoreRefs).toEqual({
    a: db.collection(5),
    c: db.collection(6)
  })
})

test('should merge two functions', () => {
  const vm = new Vue({
    mixins: [mWithObjA, mWithObjB, mWithFn]
  })
  expect(vm.$firestoreRefs).toEqual({
    a: db.collection(5),
    b: db.collection(2),
    c: db.collection(6)
  })
})

test('ignores no return', () => {
  const spy = (Vue.config.errorHandler = jest.fn())
  new Vue({
    firestore: _ => {}
  })
  expect(spy).not.toHaveBeenCalled()
  spy.mockRestore()
})
