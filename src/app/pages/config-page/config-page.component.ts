import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from '../../config/config.service';
import { GLOBAL_CONFIG_FORM_CONFIG } from '../../config/config-form-config.const';
import { ProjectService } from '../../project/project.service';
import { ConfigSectionKey, GlobalConfig } from '../../config/config.model';
import { Subscription } from 'rxjs';
import { Project, ProjectAdvancedCfg, ProjectCfgFormKey } from '../../project/project.model';
import { BASIC_PROJECT_CONFIG_FORM_CONFIG, PROJECT_CONFIG_FORM_CONFIG } from '../../project/project-form-cfg.const';
import { IssueIntegrationCfg, IssueIntegrationCfgs, IssueProviderKey } from '../../issue/issue';
import { ISSUE_PROVIDER_FORM_CFGS } from '../../issue/issue.const';
import { DEFAULT_JIRA_CFG } from '../../issue/jira/jira.const';
import { DEFAULT_GIT_CFG } from '../../issue/git/git.const';
import { dirtyDeepCopy } from '../../core/util/dirtyDeepCopy';

@Component({
  selector: 'config-page',
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.scss']
})
export class ConfigPageComponent implements OnInit, OnDestroy {
  basicProjectSettingsFormCfg;
  projectConfigFormCfg;
  issueIntegrationFormCfg;
  globalConfigFormCfg;

  currentProject: Project;
  projectCfg: ProjectAdvancedCfg;
  issueIntegrationCfgs: IssueIntegrationCfgs;
  globalCfg: GlobalConfig;

  private _subs = new Subscription();

  constructor(
    public readonly configService: ConfigService,
    public readonly projectService: ProjectService,
  ) {
    // somehow they are only unproblematic if assigned here,
    // not even sure how this is possible. ngrx formly sucks :/
    this.basicProjectSettingsFormCfg = dirtyDeepCopy(BASIC_PROJECT_CONFIG_FORM_CONFIG);
    this.projectConfigFormCfg = dirtyDeepCopy(PROJECT_CONFIG_FORM_CONFIG);
    this.issueIntegrationFormCfg = dirtyDeepCopy(ISSUE_PROVIDER_FORM_CFGS);
    this.globalConfigFormCfg = dirtyDeepCopy(GLOBAL_CONFIG_FORM_CONFIG);
  }

  ngOnInit() {
    this._subs.add(this.configService.cfg$.subscribe((cfg) => {
      this.globalCfg = cfg;
    }));
    this._subs.add(this.projectService.currentProject$.subscribe((project) => {
      this.currentProject = project;
      this.projectCfg = project.advancedCfg;
      this.issueIntegrationCfgs = project.issueIntegrationCfgs;

      // Unfortunately needed, to make sure we have no empty configs
      // TODO maybe think of a better solution for the defaults
      if (!this.issueIntegrationCfgs.JIRA) {
        this.issueIntegrationCfgs.JIRA = DEFAULT_JIRA_CFG;
      }
      if (!this.issueIntegrationCfgs.GIT) {
        this.issueIntegrationCfgs.GIT = DEFAULT_GIT_CFG;
      }
    }));
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }

  saveProjectBasicCfg($event: { sectionKey: ConfigSectionKey | ProjectCfgFormKey, config: Partial<Project> }) {
    if (!$event.config) {
      throw new Error('Not enough data');
    } else {
      this.projectService.update(this.currentProject.id, {
        ...$event.config,
      });
    }
  }

  saveIssueProviderCfg($event: { sectionKey: ConfigSectionKey | ProjectCfgFormKey, config: IssueIntegrationCfg }) {
    const {sectionKey, config} = $event;
    const sectionKey_ = sectionKey as IssueProviderKey;
    this.projectService.updateIssueProviderConfig(this.currentProject.id, sectionKey_, {
      ...config,
    }, true);
  }

  saveGlobalCfg($event: { sectionKey: ConfigSectionKey | ProjectCfgFormKey, config: any }) {
    const config = $event.config;
    const sectionKey = $event.sectionKey as ConfigSectionKey;

    if (!sectionKey || !config) {
      throw new Error('Not enough data');
    } else {
      this.configService.updateSection(sectionKey, config);
    }
  }
}
