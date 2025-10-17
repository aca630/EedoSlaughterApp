import AsyncStorage from "@react-native-async-storage/async-storage";


export default   GetToken = async () => {
 try {
      const savedUser = await AsyncStorage.getItem("user");
      const currentUser = JSON.parse(savedUser);
      return currentUser
  } catch (error) {
      console.log(error);
  }


  }