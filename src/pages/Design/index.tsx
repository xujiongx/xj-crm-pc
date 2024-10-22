import Designer from '@/components/Designer';

const DesignPage: React.FC = () => {
  const data = JSON.parse(localStorage.getItem('data') || '{}');

  return (
    <Designer
      viewConfig={data?.viewConfig}
      elements={data?.elements || []}
      // preview={true}
      handleSave={(data) => {
        console.log('😣', data);
        localStorage.setItem('data', JSON.stringify(data));
      }}
    />
  );
};

export default DesignPage;
