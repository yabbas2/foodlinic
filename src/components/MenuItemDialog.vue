<template>
  <q-dialog
    full-width
    full-height
    :model-value="props.show"
    @hide="emit('close')"
  >
    <div>
      <q-card flat class="item-carousel bg-transparent">
        <div class="row q-mb-sm">
          <q-space />
          <q-btn color="white" rounded v-close-popup>
            <q-icon color="black" name="close"></q-icon>
          </q-btn>
        </div>
        <q-carousel
          animated
          v-model="slide"
          navigation
          swipeable
          infinite
          transition-prev="slide-right"
          transition-next="slide-left"
        >
          <q-carousel-slide
            :name="1"
            img-src="https://cdn.quasar.dev/img/mountains.jpg"
          />
          <q-carousel-slide
            :name="2"
            img-src="https://cdn.quasar.dev/img/parallax1.jpg"
          />
          <q-carousel-slide
            :name="3"
            img-src="https://cdn.quasar.dev/img/parallax2.jpg"
          />
          <q-carousel-slide
            :name="4"
            img-src="https://cdn.quasar.dev/img/quasar.jpg"
          />
        </q-carousel>
      </q-card>
      <q-card class="bg-grey-1 card2">
        <q-card-section horizontal>
          <q-card-section>
            <div class="item-card-title1">
              {{ menuStore.menuProp(props.id, "name") }}
            </div>
            <div class="item-card-subtitle1">
              {{ util.formatCurrency(menuStore.menuProp(props.id, "price")) }}
            </div>
          </q-card-section>
          <q-card-section class="btn-section">
            <div class="column">
              <Transition name="cartBtn">
                <q-btn
                  v-if="cartStore.cartItemById(props.id) === 0"
                  color="secondary"
                  @click="cartStore.updateCart(props.id, 1)"
                >
                  add to cart
                </q-btn>
              </Transition>
              <Transition name="qtyBtn">
                <QtyBtn
                  v-if="cartStore.cartItemById(props.id) > 0"
                  style="light"
                  :modelValue="cartStore.cartItemById(props.id)"
                  @update:modelValue="
                    (val) => cartStore.updateCart(props.id, val)
                  "
                />
              </Transition>
            </div>
          </q-card-section>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <div class="column">
            <div class="col self-start">
              <span class="text-h6">Description</span>
            </div>
            <div class="col self-start q-my-xs">
              <span class="text-body2">
                Made with love! Put description here.
              </span>
            </div>
            <div class="col self-start q-my-xs">
              <span class="text-subtitle2">Portion: </span>
              <span class="text-body2">
                {{ menuStore.menuProp(props.id, "portion") }}
              </span>
              <q-icon
                v-if="menuStore.menuProp(props.id, 'portion') > 1"
                name="group"
              ></q-icon>
              <q-icon v-else name="person"></q-icon>
            </div>
            <div class="col self-start q-my-xs">
              <span class="text-subtitle2">Ingredients: </span>
              <span class="text-body2">
                {{ menuStore.menuProp(props.id, "ingredients") }}
              </span>
            </div>
            <div class="col self-start q-my-xs">
              <span class="text-subtitle2">Nutrition facts:</span>
              <q-markup-table
                separator="horizontal"
                dense
                flat
                bordered
                style="
                  color: inherit;
                  background-color: transparent;
                  border-color: inherit;
                "
              >
                <tbody>
                  <tr
                    v-for="nutFact in nutDetails"
                    :key="`${props.id}_${nutFact.name}`"
                  >
                    <td class="text-center">{{ nutFact.name }}</td>
                    <td class="text-center">{{ nutFact.amount }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-dialog>
</template>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");

.item-card-title1 {
  font-family: "Bebas Neue", cursive;
  color: black;
  font-size: 30px;
}
.item-card-subtitle1 {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
  letter-spacing: 0.03125em;
  color: $secondary;
}
.btn-section {
  padding: 40px 0;
  margin: auto;
  height: 120px;
}

.q-dialog__inner > div {
  //box-shadow: 0 2px 4px -1px rgb(0 0 0 / 20%),
  //            0 4px 5px rgb(0 0 0 / 14%),
  //            0 1px 10px rgb(0 0 0 / 12%);
  box-shadow: none !important;
  //border: 1px solid red;
}

.card2 {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-top: -12px;
}

.cartBtn-enter-active {
  transition: opacity 0.5s ease;
}
.cartBtn-leave-active {
  opacity: 0;
}
.cartBtn-enter-from,
.cartBtn-leave-to {
  opacity: 0;
}
.qtyBtn-enter-active {
  transition: opacity 0.5s ease;
}
.qtyBtn-leave-active {
  opacity: 0;
}
.qtyBtn-enter-from,
.qtyBtn-leave-to {
  opacity: 0;
}
</style>

<style>
.q-dialog__backdrop {
  background: rgba(0, 0, 0, 0.7) !important;
}
</style>

<script setup>
import { ref } from "vue";
import { useMenuStore } from "../stores/menu";
import { useCartStore } from "../stores/cart";
import util from "../plugins/util";
import QtyBtn from "./QtyBtn.vue";

const props = defineProps(["show", "id"]);
const menuStore = useMenuStore();
const cartStore = useCartStore();
const emit = defineEmits(["close"]);
/*TODO:remove this array and configure the nutrition facts in db*/
const nutDetails = [
  {
    name: "Fact#1",
    amount: "10%",
  },
  {
    name: "Fact#2",
    amount: "5%",
  },
  {
    name: "Fact#3",
    amount: "20%",
  },
  {
    name: "Fact#4",
    amount: "30%",
  },
  {
    name: "Fact#5",
    amount: "12%",
  },
  {
    name: "Fact#5",
    amount: "11%",
  },
];

let slide = ref(1);
</script>
