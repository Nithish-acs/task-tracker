import { useState } from 'react';
import { account } from '../src/lib/appwrite';
import { useRouter } from 'next/router';
import { ID } from 'appwrite';
import { database } from '../src/lib/appwrite';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const id = ID.unique();
      await account.create(id, email, password, name);
      const data = {
        'email': email,
        'name': name,
      }
      await database.createDocument(
        '66b31bef0026c155d454', // Replace with your database ID
        '66b36c41003881f1a29d', // Replace with your collection ID
        id,
        data,
      );
      router.push('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <h1 className="title">Sign Up</h1>
        <form className="form" onSubmit={handleRegister}>

          <>
            <div className="input-group">
              <label className="label">Name:</label>
              <input
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="input-group">
              <label className="label">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="input-group">
              <label className="label">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
              />
            </div>
            <button type="submit" className="button">Register</button>
          </>

        </form>
      </div>

      <style jsx>{`
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: #f7f7f7;
                padding: 20px;
            }

            .form-wrapper {
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 20px;
                max-width: 400px;
                width: 100%;
            }

            .title {
                margin-bottom: 20px;
                text-align: center;
                color: #333;
                font-size: 24px;
                font-weight: 600;
            }

            .form {
                display: flex;
                flex-direction: column;
            }

            .input-group {
                margin-bottom: 15px;
            }

            .label {
                display: block;
                margin-bottom: 5px;
                color: #555;
                font-weight: 500;
            }

            .input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 16px;
            }

            .button {
                background: #0070f3;
                color: #fff;
                border: none;
                border-radius: 4px;
                padding: 12px;
                font-size: 16px;
                cursor: pointer;
                transition: background 0.3s;
            }

            .button:hover {
                background: #005bb5;
            }

            .message {
                margin-top: 20px;
                color: #e74c3c;
                font-size: 14px;
                text-align: center;
            }
        `}</style>
    </div>
  );
}
