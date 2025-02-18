from flask import Flask, render_template, request
import hashlib
import base64
from cryptography.fernet import Fernet
import secrets
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
import os

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

def encrypt_aes(text, password):
    salt = os.urandom(16)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = kdf.derive(password.encode())
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    encryptor = cipher.encryptor()
    padded_data = text.encode() + b" " * (16 - (len(text) % 16))
    ct = encryptor.update(padded_data) + encryptor.finalize()
    return base64.b64encode(salt + iv + ct).decode('utf-8')

def decrypt_aes(encrypted_text, password):
    try:
        decoded = base64.b64decode(encrypted_text)
        salt = decoded[:16]
        iv = decoded[16:32]
        ct = decoded[32:]
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = kdf.derive(password.encode())
        
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
        decryptor = cipher.decryptor()
        return decryptor.update(ct).rstrip(b" ").decode('utf-8')
    except:
        return "Decryption failed"

def caesar_cipher(text, shift=3, decrypt=False):
    if decrypt:
        shift = -shift
    result = ""
    for char in text:
        if char.isalpha():
            ascii_offset = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - ascii_offset + shift) % 26 + ascii_offset)
        else:
            result += char
    return result

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_data():
    name = request.form.get('name', '')
    text = request.form.get('password', '')
    algorithm = request.form.get('algorithm', 'sha256')
    operation = request.form.get('operation', 'encrypt')
    
    result = ""
    
    if operation == 'encrypt':
        if algorithm in ['sha256', 'sha512', 'md5']:
            combined = name + text
            if algorithm == 'sha256':
                result = hashlib.sha256(combined.encode()).hexdigest()
            elif algorithm == 'sha512':
                result = hashlib.sha512(combined.encode()).hexdigest()
            else:
                result = hashlib.md5(combined.encode()).hexdigest()
        elif algorithm == 'base64':
            result = base64.b64encode((name + text).encode()).decode()
        elif algorithm == 'caesar':
            result = caesar_cipher(text)
        elif algorithm == 'aes':
            result = encrypt_aes(text, name)
    else:  # decrypt
        if algorithm == 'base64':
            try:
                result = base64.b64decode(text.encode()).decode()
            except:
                result = "Invalid Base64 string"
        elif algorithm == 'caesar':
            result = caesar_cipher(text, decrypt=True)
        elif algorithm == 'aes':
            result = decrypt_aes(text, name)
        else:
            result = "This algorithm doesn't support decryption"

    return render_template('result.html',
                         result=result,
                         algorithm=algorithm,
                         operation=operation,
                         name=name)

if __name__ == '__main__':
    app.run(debug=True)