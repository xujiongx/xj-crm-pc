import useHistorySnapshot from '@/pages/MotionVideo/PPTEditor/hooks/useHistorySnapshot';
import { PPTImageElement } from '@/pages/MotionVideo/PPTEditor/interface';
import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/PPTEditor/store';
import { ImageElementFilters } from '@/pages/MotionVideo/PPTEditor/types/slides';
import { Slider, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { defaultFilters, FilterOption, presetFilters } from './const';
import styles from './index.less';
import { filters2Style } from './utils';

const ElementFilter = () => {
  const { add } = useHistorySnapshot();
  const handleElement = useSlidesStore(
    (store) => store.activeElements,
  )()[0] as PPTImageElement;

  const handleElementId = useMainStore((state) => state.activeElementId);

  const slidesStore = useSlidesStore.getState();
  const toggleColorMask = (checked: boolean) => {
    if (!handleElement) return;
    if (checked) {
      slidesStore.updateElement({
        id: handleElement.id,
        props: { filters: {} },
      });
    } else {
      slidesStore.removeElementProps({
        id: handleElement.id,
        propName: 'filters',
      });
    }
    add();
  };
  const applyPresetFilters = (filters: ImageElementFilters) => {
    slidesStore.updateElement({ id: handleElementId, props: { filters } });
    add();
  };

  const [filterOptions, setFilterOptions] = useState<FilterOption[]>(
    JSON.parse(JSON.stringify(defaultFilters)),
  );

  useEffect(() => {
    const filters = handleElement.filters;
    if (filters) {
      const newFilters = defaultFilters.map((item) => {
        const filterItem = filters[item.key];
        if (filterItem) return { ...item, value: parseInt(filterItem) };
        return item;
      });
      setFilterOptions(newFilters);
    } else {
      const newFilters = JSON.parse(JSON.stringify(defaultFilters));
      setFilterOptions(newFilters);
    }
  }, [handleElement.filters]);

  // 设置滤镜
  const updateFilter = (filter: FilterOption, value: number) => {
    const _handleElement = handleElement as PPTImageElement;

    const originFilters = _handleElement.filters || {};
    const filters = {
      ...originFilters,
      [filter.key]: `${value}${filter.unit}`,
    };
    slidesStore.updateElement({
      id: handleElementId,
      props: { filters },
    });
    add();
  };

  return (
    <div>
      <div className={styles['switch-wrapper']}>
        <div className={styles['switch-title']}>启用滤镜：</div>
        <div className={styles['switch-operate']}>
          <Switch
            value={!!handleElement.filters}
            onChange={(v) => toggleColorMask(v)}
          />
        </div>
      </div>

      {!!handleElement.filters && (
        <div>
          <div className={styles['presets']}>
            {presetFilters.map((item) => (
              <div
                className={styles['preset-item']}
                key={item.label}
                onClick={() => applyPresetFilters(item.values)}
              >
                <img
                  src={handleElement.src}
                  alt=""
                  style={{ filter: filters2Style(item.values) }}
                />
                <span className={styles['presets-label']}>{item.label}</span>
              </div>
            ))}
          </div>
          <div className={styles['filter']}>
            {filterOptions.map((item) => (
              <div key={item.key} className={styles['filter-item']}>
                <div className={styles['name']}>{item.label}</div>
                <Slider
                  min={0}
                  max={item.max}
                  step={item.step}
                  value={item.value}
                  onChange={(value) => {
                    updateFilter(item, value);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementFilter;
