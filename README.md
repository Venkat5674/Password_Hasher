# Password Hasher

A simple utility for securely hashing passwords using industry-standard cryptographic algorithms.

## Features

- Secure password hashing using bcrypt
- Salt generation and management
- Easy-to-use API
- Input validation
- Cross-platform compatibility

## Installation

```bash
npm install
```

## Usage

```javascript
const hasher = new PasswordHasher();

// Hash a password
const hashedPassword = await hasher.hash('myPassword123');

// Verify a password
const isValid = await hasher.verify('myPassword123', hashedPassword);
```

## Security

This utility uses bcrypt with a work factor of 10 by default. The salt is automatically generated and stored with the hash.

## License

MIT License
