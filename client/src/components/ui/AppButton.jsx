import { forwardRef } from 'react';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}


// Supported variants:
// - text: text button, emerald hover
// - primary: emerald background
// - blue: blue background
// - outline: (not styled yet)
const VARIANT_CLASSNAMES = {
  text: 'text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors',
  primary:
    'bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm',
  blue:
    'bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm',
  outline:
    'border border-emerald-600 text-emerald-600 bg-white hover:bg-emerald-50 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
};

const AppButton = forwardRef(function AppButton(
  {
    variant = 'text',
    className,
    type = 'button',
    disabled,
    onClick,
    children,
    ...rest
  },
  ref
) {
  const variantClassName = VARIANT_CLASSNAMES[variant] || '';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cx(variantClassName, className)}
      {...rest}
    >
      {children}
    </button>
  );
});

export default AppButton;
