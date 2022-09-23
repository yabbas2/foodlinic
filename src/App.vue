<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

:root {
  --font-open-sans: "Open Sans",sans-serif;
  --font-comfortaa: 'Comfortaa', cursive;
  --font-roboto: "Roboto", sans-serif;
  --font-inter: "Inter", sans-serif;
}

/*----------- Colors -----------*/
:root {
  --color-default: #212529;
  --color-primary: #f25b47;
  --color-secondary: #37373f;
  --color-tertiary: #39175c;
}

/*----------- Smooth scroll behavior -----------*/
:root {
  scroll-behavior: smooth;
}

/*----------- General -----------*/
body {
  font-family: var(--font-open-sans);
  color: var(--color-default);
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-roboto);
}
</style>
