import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { SettingsPageTitle } from '@strapi/helper-plugin';
import { Button, ContentLayout, HeaderLayout, Layout, Loader, Main } from '@strapi/design-system';
import { Check } from '@strapi/icons';

import { Stages } from './components/Stages';
import { reducer } from './reducer';
import { REDUX_NAMESPACE } from './constants';
import { useInjectReducer } from '../../../../../../admin/src/hooks/useInjectReducer';
import { useReviewWorkflows } from './hooks/useReviewWorkflows';
import { setWorkflows } from './actions';

export function ReviewWorkflowsPage() {
  const { formatMessage } = useIntl();
  const { workflows: workflowsData } = useReviewWorkflows();
  const state = useSelector((state) => state?.[REDUX_NAMESPACE]);
  const dispatch = useDispatch();

  useInjectReducer(REDUX_NAMESPACE, reducer);

  useEffect(() => {
    dispatch(setWorkflows({ status: workflowsData.status, data: workflowsData.data }));
  }, [workflowsData.status, workflowsData.data, dispatch]);

  // useInjectReducer() runs on the first rendering after useSelector
  // which will return undefined. This helps to avoid too many optional
  // chaining operators down the component.
  if (!state) {
    return null;
  }

  const {
    status,
    serverState: { workflows },
  } = state;

  const defaultWorkflow = workflows[0] ?? {};

  return (
    <Layout>
      <SettingsPageTitle
        name={formatMessage({
          id: 'Settings.review-workflows.page.title',
          defaultMessage: 'Review Workflows',
        })}
      />
      <Main tabIndex={-1}>
        <HeaderLayout
          primaryAction={
            <Button startIcon={<Check />} type="submit" size="L" disabled>
              {formatMessage({
                id: 'global.save',
                defaultMessage: 'Save',
              })}
            </Button>
          }
          title={formatMessage({
            id: 'Settings.review-workflows.page.title',
            defaultMessage: 'Review Workflows',
          })}
          subtitle={formatMessage(
            {
              id: 'Settings.review-workflows.page.subtitle',
              defaultMessage: '{count, plural, one {# stage} other {# stages}}',
            },
            { count: defaultWorkflow.stages?.length ?? 0 }
          )}
        />
        <ContentLayout>
          {status === 'loading' ? (
            <Loader>
              {formatMessage({
                id: 'Settings.review-workflows.page.isLoading',
                defaultMessage: 'Workflow is loading',
              })}
            </Loader>
          ) : (
            <Stages stages={defaultWorkflow.stages} />
          )}
        </ContentLayout>
      </Main>
    </Layout>
  );
}