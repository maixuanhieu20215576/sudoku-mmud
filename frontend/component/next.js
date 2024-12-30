'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Router } from 'next/router';

function Button() {
    const pathname = usePathname();
    const re = /\/level\/(\d)/;

    return (
        <Link
            href={`/level/${Number(pathname.match(re)[1]) + 1}`}
            style={{ textDecoration: 'underline', fontWeight: '700' }}
        >
            Next
        </Link>
    );
}

export default Button;
