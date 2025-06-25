import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import os
import struct
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from os import urandom
import subprocess
import webbrowser
import platform

class EncriptadorApp:
    def __init__(self, master):
        self.master = master
        self.master.title("Encriptador de Soportes PDF - MALLAMAS EPS-I")
        self.master.geometry("700x400")

        # Archivos en memoria
        self.pdf_path = None
        self.pem_path = None
        self.file_data = None
        self.encrypted_data = None
        self.encrypted_key = None

        # Widgets
        self.create_widgets()

    def create_widgets(self):
        frame = tk.Frame(self.master)
        frame.pack(side=tk.LEFT, fill=tk.Y, padx=10, pady=10)

        tk.Label(frame, text="Opciones:").pack()
        tk.Button(frame, text="Generar clave de prueba", command=self.generar_clave_prueba).pack(pady=5)

        right_frame = tk.Frame(self.master)
        right_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=10, pady=10)

        tk.Label(right_frame, text="Archivo PDF:").pack()
        pdf_frame = tk.Frame(right_frame)
        pdf_frame.pack(fill=tk.X)
        self.label_pdf = tk.Label(pdf_frame, text="No se ha seleccionado ningún archivo PDF", fg="gray")
        self.label_pdf.pack(side=tk.LEFT, expand=True, fill=tk.X)
        tk.Button(pdf_frame, text="Abrir", command=self.abrir_pdf).pack(side=tk.LEFT)
        tk.Button(pdf_frame, text="Ubicación", command=lambda: self.abrir_carpeta(self.pdf_path)).pack(side=tk.LEFT)
        tk.Button(pdf_frame, text="Eliminar", command=self.deseleccionar_pdf).pack(side=tk.LEFT)
        tk.Button(right_frame, text="Seleccionar PDF", command=self.select_pdf).pack(pady=5)

        tk.Label(right_frame, text="Llave Pública RSA (.pem):").pack()
        pem_frame = tk.Frame(right_frame)
        pem_frame.pack(fill=tk.X)
        self.label_pem = tk.Label(pem_frame, text="No se ha seleccionado ninguna clave", fg="gray")
        self.label_pem.pack(side=tk.LEFT, expand=True, fill=tk.X)
        tk.Button(pem_frame, text="Ubicación", command=lambda: self.abrir_carpeta(self.pem_path)).pack(side=tk.LEFT)
        tk.Button(pem_frame, text="Eliminar", command=self.deseleccionar_pem).pack(side=tk.LEFT)
        tk.Button(right_frame, text="Seleccionar llave pública", command=self.select_pem).pack(pady=5)

        self.progress = ttk.Progressbar(right_frame, orient="horizontal", length=400, mode="determinate")
        self.progress.pack(pady=(15, 0))

        self.encrypt_button = tk.Button(right_frame, text="Encriptar archivo", command=self.encrypt_file)
        self.encrypt_button.pack(pady=10)

        self.save_button = tk.Button(right_frame, text="Guardar archivos cifrados", command=self.save_files)
        self.save_button.pack(pady=5)
        self.save_button.config(state=tk.DISABLED)

    def select_pdf(self):
        file = filedialog.askopenfilename(filetypes=[("Archivos PDF", "*.pdf")])
        if file:
            self.pdf_path = file
            self.label_pdf.config(text=os.path.basename(file), fg="black")

    def select_pem(self):
        file = filedialog.askopenfilename(filetypes=[("Clave pública RSA", "*.pem")])
        if file:
            self.pem_path = file
            self.label_pem.config(text=os.path.basename(file), fg="black")

    def deseleccionar_pdf(self):
        self.pdf_path = None
        self.label_pdf.config(text="No se ha seleccionado ningún archivo PDF", fg="gray")

    def deseleccionar_pem(self):
        self.pem_path = None
        self.label_pem.config(text="No se ha seleccionado ninguna clave", fg="gray")

    def abrir_pdf(self):
        if self.pdf_path:
            webbrowser.open_new(self.pdf_path)

    def abrir_carpeta(self, path):
        if path:
            folder = os.path.dirname(os.path.abspath(path))
            if platform.system() == "Windows":
                os.startfile(folder)
            elif platform.system() == "Darwin":
                subprocess.Popen(["open", folder])
            else:
                subprocess.Popen(["xdg-open", folder])

    def generar_clave_prueba(self):
        key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        priv_key = key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        pub_key = key.public_key().public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        with open("clave_prueba.pem", "wb") as f:
            f.write(pub_key)
        with open("clave_prueba_privada.pem", "wb") as f:
            f.write(priv_key)
        messagebox.showinfo("Clave generada", "Se generó una clave pública de prueba en el directorio actual.")

    def encrypt_file(self):
        if not self.pdf_path or not self.pem_path:
            messagebox.showerror("Error", "Debes seleccionar el PDF y la clave pública primero.")
            return

        try:
            self.progress.start(10)
            self.master.update()

            with open(self.pdf_path, "rb") as f:
                self.file_data = f.read()

            filename = os.path.basename(self.pdf_path)
            extension = ".pdf"
            ext_bytes = extension.encode('utf-8')
            ext_length = struct.pack(">I", len(ext_bytes))

            aes_key = urandom(32)
            iv = urandom(16)

            pad_len = 16 - len(self.file_data) % 16
            padded_data = self.file_data + bytes([pad_len] * pad_len)

            cipher = Cipher(algorithms.AES(aes_key), modes.CBC(iv), backend=default_backend())
            encryptor = cipher.encryptor()
            encrypted_file = encryptor.update(padded_data) + encryptor.finalize()

            self.encrypted_data = ext_length + ext_bytes + iv + encrypted_file

            with open(self.pem_path, "rb") as key_file:
                public_key = serialization.load_pem_public_key(key_file.read(), backend=default_backend())

            self.encrypted_key = public_key.encrypt(
                aes_key,
                padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(), label=None)
            )

            self.progress.stop()
            messagebox.showinfo("Éxito", "Archivo cifrado correctamente. Puedes guardarlo ahora.")
            self.save_button.config(state=tk.NORMAL)

        except Exception as e:
            self.progress.stop()
            messagebox.showerror("Error", f"Fallo al cifrar el archivo: {str(e)}")

    def save_files(self):
        directory = filedialog.askdirectory()
        if not directory:
            return

        base = os.path.basename(self.pdf_path)
        enc_path = os.path.join(directory, base + ".enc")
        key_path = os.path.join(directory, base + ".key")

        try:
            with open(enc_path, "wb") as f:
                f.write(self.encrypted_data)

            with open(key_path, "wb") as f:
                f.write(self.encrypted_key)

            messagebox.showinfo("Guardado", f"Archivos guardados correctamente en:\n{directory}")
        except Exception as e:
            messagebox.showerror("Error al guardar", str(e))

if __name__ == "__main__":
    root = tk.Tk()
    app = EncriptadorApp(root)
    root.mainloop()
