'use client';

import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormValues } from '@/app/lib/schema';
import { checkPasswordStrength } from '@/app/lib/utils';
import PasswordStrengthMeter from '../PasswordStrengthMeter/PasswordStrengthMeter';
import styles from './RHFForm.module.css';
import { useEffect, useState } from 'react';
import { type StoredFormData } from '@/app/store/formStore';
import Autocomplete from '../Autocomplete/Autocomplete';
import { useFormStore } from '@/app/store/formStore';

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface RHFFormProps {
  onSubmit: (data: Omit<StoredFormData, 'id'>) => void;
}

export default function RHFForm({ onSubmit }: RHFFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: '',
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      terms: false,
    },
  });

  const { countries, fetchCountries } = useFormStore();
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const password = watch('password');
  const strengthScore = checkPasswordStrength(password || '');

  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const pictureFile = watch('picture');

  useEffect(() => {
    if (pictureFile && pictureFile.length > 0) {
      const file = pictureFile[0];
      const previewUrl = URL.createObjectURL(file);
      setPicturePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
    setPicturePreview(null);
  }, [pictureFile]);

  const processSubmit: SubmitHandler<FormValues> = async (data) => {
    const pictureBase64 = await toBase64(data.picture[0]);
    const { confirmPassword: _confirmPassword, ...dataToSubmit } = data;

    const finalData: Omit<StoredFormData, 'id'> = {
      ...dataToSubmit,
      age: Number(dataToSubmit.age),
      picture: pictureBase64,
    };

    onSubmit(finalData);
  };

  return (
    <form
      onSubmit={handleSubmit(processSubmit)}
      className={styles.form}
      noValidate
    >
      {/* Name */}
      <div className={styles.field}>
        <label htmlFor="name-rhf">Name</label>
        <input id="name-rhf" type="text" {...register('name')} />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
      </div>

      {/* Age */}
      <div className={styles.field}>
        <label htmlFor="age-rhf">Age</label>
        <input id="age-rhf" type="text" {...register('age')} />
        {errors.age && <p className={styles.error}>{errors.age.message}</p>}
      </div>

      {/* Email */}
      <div className={styles.field}>
        <label htmlFor="email-rhf">Email</label>
        <input id="email-rhf" type="email" {...register('email')} />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className={styles.field}>
        <label htmlFor="password-rhf">Password</label>
        <input id="password-rhf" type="password" {...register('password')} />
        <PasswordStrengthMeter score={strengthScore} />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className={styles.field}>
        <label htmlFor="confirmPassword-rhf">Confirm Password</label>
        <input
          id="confirmPassword-rhf"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className={styles.error}>{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Gender */}
      <div className={styles.field}>
        <label htmlFor="gender-rhf">Gender</label>
        <select id="gender-rhf" defaultValue="" {...register('gender')}>
          <option value="" disabled>
            Select gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p className={styles.error}>{errors.gender.message}</p>
        )}
      </div>

      {/* Country */}
      <div className={styles.field}>
        <label htmlFor="country-rhf">Country</label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Autocomplete
              id="country-rhf"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              suggestions={countries.map((c) => c.name.common)}
            />
          )}
        />
        {errors.country && (
          <p className={styles.error}>{errors.country.message}</p>
        )}
      </div>

      {/* Profile Pic */}
      <div className={styles.field}>
        <label htmlFor="picture-rhf">Profile Picture</label>
        <input
          id="picture-rhf"
          type="file"
          accept="image/png, image/jpeg"
          {...register('picture')}
        />
        {picturePreview && (
          <img src={picturePreview} alt="Preview" className={styles.preview} />
        )}
        {errors.picture && (
          <p className={styles.error}>{errors.picture.message as string}</p>
        )}
      </div>

      {/* Accept Checkbox */}
      <div className={styles.fieldCheckbox}>
        <input id="terms-rhf" type="checkbox" {...register('terms')} />
        <label htmlFor="terms-rhf">I accept the Terms and Conditions</label>
        {errors.terms && <p className={styles.error}>{errors.terms.message}</p>}
      </div>

      <button type="submit" className={styles.submitButton} disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}
