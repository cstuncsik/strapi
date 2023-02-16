import React from 'react';
import PropTypes from 'prop-types';
import { ReactSelect, useCMEditViewDataManager } from '@strapi/helper-plugin';

import { useReviewWorkflows } from '../../../../pages/SettingsPage/pages/ReviewWorkflows/hooks/useReviewWorkflows';

export function ReviewWorkflowSelect({ name = 'strapi_reviewWorkflows_stage' }) {
  const { initialData } = useCMEditViewDataManager();
  const activeStage = initialData[name];
  // TODO: workflows doesn't make much sense here
  const { workflows: workflow, setStageForEntity } = useReviewWorkflows(activeStage.workflow);
  const { stages } = workflow;
  const options = stages.map(({ id, name }) => ({ value: id, label: name }));

  const onChange = async (stage) => {
    // eslint-disable-next-line no-unused-vars
    const { isLoading, error } = await setStageForEntity(stage);
  };

  return <ReactSelect options={options} onChange={onChange} name={name} value={activeStage?.id} />;
}

ReviewWorkflowSelect.propTypes = {
  name: PropTypes.string.isRequired,
};
