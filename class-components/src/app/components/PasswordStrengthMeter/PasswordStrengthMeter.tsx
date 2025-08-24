import styles from './PasswordStrengthMeter.module.css';

interface PasswordStrengthMeterProps {
  score: number;
}

const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

export default function PasswordStrengthMeter({
  score,
}: PasswordStrengthMeterProps) {
  const strength = score > 0 ? strengthLabels[score - 1] : '';

  return (
    <div className={styles.strengthMeter}>
      <div className={styles.bars}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`${styles.bar} ${score > index ? styles[`strength-${strength.toLowerCase()}`] : ''}`}
          ></div>
        ))}
      </div>
      {strength && <p className={styles.label}>{strength}</p>}
    </div>
  );
}
