type CheckboxInputPropsType = {
  label: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => any;
  value?:
    | 'game'
    | 'accessories'
    | 'Sony'
    | 'EA'
    | 'Ubisoft'
    | 'Eureka'
    | 'Acer'
    | 'Ant'
    | 'Razer'
    | 'Redclutch'
    | 'Qbik'
    | 'GreenSoul'
    | 'PC'
    | 'PS'
    | 'Teen'
    | 'Everyone'
    | 'Mature';
  checked: boolean;
  name: 'category' | 'brand' | 'priceRange' | 'platform' | 'esrbRating' | 'outOfStock' | 'fastDelivery';
  className: string;
};

const CheckboxInput = ({ label, id, ...otherProps }: CheckboxInputPropsType) => {
  const style = {
    display: 'grid',
    gridTemplateColumns: '1em auto',
    gap: '0.5em',
    alignItems: 'center',
  };

  return (
    <li>
      <label htmlFor={id} style={style}>
        <input type="checkbox" id={id} {...otherProps} />
        {label}
      </label>
    </li>
  );
};

export default CheckboxInput;
