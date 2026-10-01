import {
  Controller,
  type Control,
  type FieldError,
  type FieldValues,
  type Path,
} from "react-hook-form";
import "./InputFormCustom.scss";

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  error?: FieldError | undefined;
}

const InputFormCustom = <T extends FieldValues>({
  name,
  control,
  label,
  type,
  error,
}: Props<T>) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            type={type || "text"}
            {...field}
            className={`form-control ${error ? "is-invalid" : ""}`}
          />
        )}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

export default InputFormCustom;
