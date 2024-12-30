'use client';
function Error({ error }) {
    return (
        <div
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: '700',
                fontSize: '1.2rem',
            }}
        >
            {error.message}
        </div>
    );
}

export default Error;
