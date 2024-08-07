import { Client, Users } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('66b2f8df001c77a46797'); // Your project ID

    // Initialize the Users service
const users = new Users(client);

// Create a new user
users.create(
    'unique()',              // Generate a unique ID for the user
    'user@example.com',      // User email
    'password',              // User password
    'User Name'              // User name
)
.then(response => {
    console.log('User created:', response);
})
.catch(error => {
    console.error('Error creating user:', error);
});