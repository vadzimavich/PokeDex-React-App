'use client';

import { useRef, useState, type FormEvent, useEffect } from 'react';
import { formSchema, type FormValues } from '@/app/lib/schema';
import { checkPasswordStrength, toBase64 } from '@/app/lib/utils';
import PasswordStrengthMeter from '../PasswordStrengthMeter/PasswordStrengthMeter';
import styles from './UncontrolledForm.module.css';
import { type StoredFormData } from '@/app/store/formStore';
import Autocomplete from '../Autocomplete/Autocomplete';
import { useFormStore } from '@/app/store/formStore';

type FormErrors = Partial<Record<keyof FormValues, string>>;

interface UncontrolledFormProps {
  onSubmit: (data: Omit<StoredFormData, 'id'>) => void;
}

export default function UncontrolledForm({ onSubmit }: UncontrolledFormProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const pictureRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);

  const { countries, fetchCountries } = useFormStore();
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPicturePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setPicturePreview(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = {
      name: nameRef.current?.value ?? '',
      age: ageRef.current?.value ?? '',
      email: emailRef.current?.value ?? '',
      password: passwordRef.current?.value ?? '',
      confirmPassword: confirmPasswordRef.current?.value ?? '',
      gender: genderRef.current?.value ?? '',
      terms: termsRef.current?.checked ?? false,
      picture: pictureRef.current?.files,
      country: countryRef.current?.value ?? '',
    };

    const validationResult = formSchema.safeParse(formData);

    if (!validationResult.success) {
      const formattedErrors: FormErrors = {};
      for (const issue of validationResult.error.issues) {
        formattedErrors[issue.path[0] as keyof FormValues] = issue.message;
      }
      setErrors(formattedErrors);
      return;
    }

    setErrors({});

    const pictureBase64 = await toBase64(validationResult.data.picture[0]);
    const { confirmPassword: _confirmPassword, ...dataToSubmit } =
      validationResult.data;

    const finalData: Omit<StoredFormData, 'id'> = {
      ...dataToSubmit,
      age: Number(dataToSubmit.age),
      picture: pictureBase64,
    };

    onSubmit(finalData);
  };

  const strengthScore = checkPasswordStrength(password);

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {/* Name */}
      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" ref={nameRef} />
        {errors.name && <p className={styles.error}>{errors.name}</p>}
      </div>

      {/* Age */}
      <div className={styles.field}>
        <label htmlFor="age">Age</label>
        <input id="age" name="age" type="text" ref={ageRef} />
        {errors.age && <p className={styles.error}>{errors.age}</p>}
      </div>

      {/* Email (fullWidth) */}
      <div className={`${styles.field} ${styles.fullWidth}`}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" ref={emailRef} />
        {errors.email && <p className={styles.error}>{errors.email}</p>}
      </div>

      {/* Password */}
      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          ref={passwordRef}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordStrengthMeter score={strengthScore} />
        {errors.password && <p className={styles.error}>{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div className={styles.field}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          ref={confirmPasswordRef}
        />
        {errors.confirmPassword && (
          <p className={styles.error}>{errors.confirmPassword}</p>
        )}
      </div>

      {/* Gender */}
      <div className={styles.field}>
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender" ref={genderRef} defaultValue="">
          <option value="" disabled>
            Select gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className={styles.error}>{errors.gender}</p>}
      </div>

      {/* Country */}
      <div className={styles.field}>
        <label htmlFor="country">Country</label>
        <Autocomplete
          id="country"
          name="country"
          inputRef={countryRef}
          suggestions={countries.map((c) => c.name.common)}
        />
        {errors.country && <p className={styles.error}>{errors.country}</p>}
      </div>

      {/* Profile Picture (fullWidth) */}
      <div className={`${styles.field} ${styles.fullWidth}`}>
        <label htmlFor="picture">Profile Picture</label>
        <input
          id="picture"
          name="picture"
          type="file"
          accept="image/png, image/jpeg"
          ref={pictureRef}
          onChange={handlePictureChange}
        />
        {picturePreview && (
          <img src={picturePreview} alt="Preview" className={styles.preview} />
        )}
        {errors.picture && <p className={styles.error}>{errors.picture}</p>}
      </div>

      {/* Terms Checkbox (fullWidth) */}
      <div className={`${styles.fieldCheckbox} ${styles.fullWidth}`}>
        <input id="terms" name="terms" type="checkbox" ref={termsRef} />
        <label htmlFor="terms">I accept the Terms and Conditions</label>
        {errors.terms && <p className={styles.error}>{errors.terms}</p>}
      </div>

      {/* Submit Button (fullWidth) */}
      <div className={styles.fullWidth}>
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </div>
    </form>
  );
}
