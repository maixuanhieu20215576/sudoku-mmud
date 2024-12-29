import './globals.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <script src="/snarkjs.min.js"></script>
            </head>
            <body>{children}</body>
        </html>
    );
}
