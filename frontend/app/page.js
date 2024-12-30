import styles from './page.module.css';
import { redirect } from 'next/navigation';

export default function Home() {
    return redirect('/level/1');
}
// 3. Tạo proof với snarkjs
// const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
//   input,
//   sudokuWasm,
//   sudokuZkey
// );
