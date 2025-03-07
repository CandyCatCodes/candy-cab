import { Redirect } from "expo-router";

const Home = () => {
  return <Redirect href="/(auth)/welcome" />;
};

export default Home;

//now, we can see that the Home component is a functional component that returns a Redirect component from expo-router. The Redirect component is used to redirect the user to a different route, in this case, the "(auth)/welcome" route. This means that when the user navigates to the Home route, they will be redirected to the "(auth)/welcome" route. This is a common pattern in navigation and routing in React Native applications.
//The Redirect component takes a href prop, which specifies the route to redirect to. In this case, the href prop is set to "/(auth)/welcome", which is the route to the welcome screen in the authentication flow. This means that when the user navigates to the Home route, they will be redirected to the welcome screen in the authentication flow.
