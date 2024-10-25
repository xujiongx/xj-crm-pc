import Designer from '@/components/Designer';

const DesignPage: React.FC = () => {
  const data = JSON.parse(localStorage.getItem('data') || '{}');

  return (
    <Designer
      value={{
        elements: data?.elements,
        viewConfig: data?.viewConfig,
      }}
      onChange={(data) => {
        console.log('👩‍🎨onChange', data);
      }}
      handleSave={(data) => {
        console.log('😣handleSave', data);
        localStorage.setItem('data', JSON.stringify(data));
      }}
      handlePublic={(data) => {
        console.log('😣handlePublic', data);
        localStorage.setItem('data', JSON.stringify(data));
      }}
    />
  );
};

export default DesignPage;
