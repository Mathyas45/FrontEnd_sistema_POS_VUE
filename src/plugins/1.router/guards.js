export const setupGuards = (router) => {
  router.beforeEach((to) => {
    const isLoggedIn =
      localStorage.getItem("token") && localStorage.getItem("user"); //!!(useCookie('userData').value && useCookie('accessToken').value)

    /*
          If user is logged in and is trying to access login like page, redirect to home
          else allow visiting the page
          (WARN: Don't allow executing further by return statement because next code will check for permissions)
         */
    if (to.meta.unauthenticatedOnly) {
      if (isLoggedIn) return "/";
      else return undefined;
    }
    if (!isLoggedIn && to.matched.length) {
      /* eslint-disable indent */
      return isLoggedIn
        ? { name: "not-authorized" }
        : {
            name: "login",
            query: {
              ...to.query,
              to: to.fullPath !== "/" ? to.path : undefined,
            },
          };
      /* eslint-enable indent */
    }
  });
};
