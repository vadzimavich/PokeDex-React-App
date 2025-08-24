'use client';

import { useRef, useState, type FormEvent } from 'react';
import { formSchema, type FormValues } from '@/app/lib/schema';
import styles from './UncontrolledForm.module.css';
import { type StoredFormData } from '@/app/store/formStore';

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type FormErrors = Partial<Record<keyof FormValues, string>>;

interface UncontrolledFormProps {
  onSubmit: (data: StoredFormData) => void;
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

  const [errors, setErrors] = useState<FormErrors>({});
  const [picturePreview, setPicturePreview] = useState<string | null>(null);

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPicturePreview(URL.createObjectURL(file));
    } else {
      setPicturePreview(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

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

    const pictureBase64 = await toBase64(validationResult.data.picture[0]);
    const { confirmPassword: _confirmPassword, ...dataToSubmit } =
      validationResult.data;

    const finalData: StoredFormData = {
      ...dataToSubmit,
      age: Number(dataToSubmit.age),
      picture: pictureBase64,
    };

    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" ref={nameRef} />
        {errors.name && <p className={styles.error}>{errors.name}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="age">Age</label>
        <input id="age" name="age" type="text" ref={ageRef} />
        {errors.age && <p className={styles.error}>{errors.age}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" ref={emailRef} />
        {errors.email && <p className={styles.error}>{errors.email}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          ref={passwordRef}
        />
        {errors.password && <p className={styles.error}>{errors.password}</p>}
      </div>

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

      <div className={styles.field}>
        <label htmlFor="country">Country</label>
        <input id="country" name="country" type="text" ref={countryRef} />
        {errors.country && <p className={styles.error}>{errors.country}</p>}
      </div>

      <div className={styles.field}>
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

      <div className={styles.fieldCheckbox}>
        <input id="terms" name="terms" type="checkbox" ref={termsRef} />
        <label htmlFor="terms">I accept the Terms and Conditions</label>
        {errors.terms && <p className={styles.error}>{errors.terms}</p>}
      </div>

      <button type="submit" className={styles.submitButton}>
        Submit
      </button>
    </form>
  );
}
