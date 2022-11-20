import styles from '../styles/Home.module.css';
import { TextAliveView } from '../components/TextAliveView';

export default function Home() {

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <TextAliveView />
      </main>
    </div>
  );
}
