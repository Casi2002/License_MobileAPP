import { Client, Account, ID, Avatars, Databases, Query } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.BachelorDegree.SmartSafe',
    projectId: '667383840019dae936a2',
    databaseId: '66738547000f1e145575',
    userCollectionId: '66738579002936ae4f2b',
    valuableItemsCollectionId: '667385c0002e65f0bfc4',
    storageId: '66738f19002df6d3db77',
    moneyId: '66784de500356f421ce3'
}



const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


//Create User
export const createUser = async (email, password, name) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            name
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(name);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                name: name,
                avatar: avatarUrl
            }
        );

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

//Sign In
export async function signIn(email, password){
    try {
        const session = await account.createEmailPasswordSession(email, password)

        return session;
    } catch (error) {
        throw new Error(error)
    }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

  // Get modifications made by user
export async function getUserModifications(userId) {
    try {
      const mods = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.valuableItemsCollectionId,
        [Query.equal("user", userId)]
      );
  
      return mods.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

// Delete chosed item by the user
export async function deleteChosedValuableItem(query) {
  try {
    // Search for the document(s) by Object_Name
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.valuableItemsCollectionId,
      [Query.equal("Object_Name", query.Object_Name)]
    );

    // Check if any documents are found
    if (!posts.documents.length) {
      throw new Error("Valuable Item not found inside the DB");
    }

    // Loop through and delete each matched document
    for (const doc of posts.documents) {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.valuableItemsCollectionId,
        doc.$id  // Delete document by its ID
      );
    }

    return posts.documents;
  } catch (error) {
    throw new Error(error.message);  // Return the error message
  }
  }

// Adding the item to the valuable items 
export async function addNewValuableItem(form){
  try{
    const NewValuableItem = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.valuableItemsCollectionId,
      ID.unique(),
      {
        Object_Name: form.Object_Name,
        Object_Description: form.Object_Description,
        Object_Value: form.Object_Value,
      }
    );

    return NewValuableItem;
  } catch (error) {
    throw new Error(error);
  }
}

// Get money value from the safe
export async function getMoney() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.moneyId
    );
    
    // Check if any documents were returned
    if (response.documents.length === 0) {
      throw new Error("No documents found");
    }

    console.log("Most recent document:", response);

    // Extract the amount from the first document
    const document = response.documents[0];
    const amount = document.money;
    
    // Return the amount
    return amount;
  } catch (error) {
    console.error("Error in getMoney:", error); // Log the error
    throw error; // Rethrow the error to handle it in the component
  }
}

// Get valuable items added
export async function getUserItems() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.valuableItemsCollectionId,
    );


    console.log("Valuable items:", posts);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}