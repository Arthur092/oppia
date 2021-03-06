// Copyright 2020 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Component for the subtopic editor tab directive.
 */
require(
  'components/forms/custom-forms-directives/thumbnail-uploader.directive.ts');

require('domain/editor/undo_redo/undo-redo.service.ts');
require('domain/topic/topic-update.service.ts');
require('domain/utilities/url-interpolation.service.ts');

// TODO(#9186): Change variable name to 'constants' once this file
// is migrated to Angular.
const subtopicConstants2 = require('constants.ts');

require('domain/editor/undo_redo/undo-redo.service.ts');
require('domain/topic/topic-update.service.ts');
require('domain/utilities/url-interpolation.service.ts');
require('services/contextual/url.service.ts');
require('pages/topic-editor-page/services/topic-editor-state.service.ts');
require('pages/topic-editor-page/services/entity-creation.service.ts');
require('pages/topic-viewer-page/subtopics-list/subtopics-list.component.ts');

angular.module('oppia').component('subtopicEditorTab', {
  template: require('./subtopic-editor-tab.component.html'),
  controller: [
    '$scope', 'SubtopicValidationService', 'TopicEditorStateService',
    'TopicUpdateService',
    'EntityCreationService',
    'TopicEditorRoutingService',
    'UrlInterpolationService', 'EVENT_TOPIC_REINITIALIZED',
    'EVENT_TOPIC_INITIALIZED', 'EVENT_SUBTOPIC_PAGE_LOADED',
    'MAX_CHARS_IN_SUBTOPIC_TITLE',
    function(
        $scope, SubtopicValidationService, TopicEditorStateService,
        TopicUpdateService,
        EntityCreationService,
        TopicEditorRoutingService,
        UrlInterpolationService, EVENT_TOPIC_REINITIALIZED,
        EVENT_TOPIC_INITIALIZED, EVENT_SUBTOPIC_PAGE_LOADED,
        MAX_CHARS_IN_SUBTOPIC_TITLE) {
      var ctrl = this;
      var SKILL_EDITOR_URL_TEMPLATE = '/skill_editor/<skillId>';
      ctrl.MAX_CHARS_IN_SUBTOPIC_TITLE = MAX_CHARS_IN_SUBTOPIC_TITLE;
      var _initEditor = function() {
        ctrl.topic = TopicEditorStateService.getTopic();
        ctrl.subtopicId = TopicEditorRoutingService.getSubtopicIdFromUrl();
        ctrl.subtopic = ctrl.topic.getSubtopicById(
          parseInt(ctrl.subtopicId));
        ctrl.errorMsg = null;
        if (ctrl.topic.getId() && ctrl.subtopic) {
          TopicEditorStateService.loadSubtopicPage(
            ctrl.topic.getId(), ctrl.subtopicId);

          ctrl.editableTitle = ctrl.subtopic.getTitle();
          ctrl.editableThumbnailFilename = (
            ctrl.subtopic.getThumbnailFilename());
          ctrl.editableThumbnailBgColor = (
            ctrl.subtopic.getThumbnailBgColor());
          ctrl.subtopicPage = (
            TopicEditorStateService.getSubtopicPage());
          ctrl.allowedBgColors = (
            subtopicConstants2.ALLOWED_THUMBNAIL_BG_COLORS.subtopic);
          var pageContents = ctrl.subtopicPage.getPageContents();
          if (pageContents) {
            ctrl.htmlData = pageContents.getHtml();
          }
          ctrl.uncategorizedSkillSummaries = (
            ctrl.topic.getUncategorizedSkillSummaries());
        }
      };

      ctrl.updateSubtopicTitle = function(title) {
        if (title === ctrl.subtopic.getTitle()) {
          return;
        }

        if (!SubtopicValidationService.checkValidSubtopicName(title)) {
          ctrl.errorMsg = 'A subtopic with this title already exists';
          return;
        }

        TopicUpdateService.setSubtopicTitle(
          ctrl.topic, ctrl.subtopic.getId(), title);
        ctrl.editableTitle = title;
      };

      ctrl.updateSubtopicThumbnailFilename = function(
          newThumbnailFilename) {
        var oldThumbnailFilename = ctrl.subtopic.getThumbnailFilename();
        if (newThumbnailFilename === oldThumbnailFilename) {
          return;
        }
        TopicUpdateService.setSubtopicThumbnailFilename(
          ctrl.topic, ctrl.subtopic.getId(), newThumbnailFilename);
        ctrl.editableThumbnailFilename = newThumbnailFilename;
      };

      ctrl.updateSubtopicThumbnailBgColor = function(
          newThumbnailBgColor) {
        var oldThumbnailBgColor = ctrl.subtopic.getThumbnailBgColor();
        if (newThumbnailBgColor === oldThumbnailBgColor) {
          return;
        }
        TopicUpdateService.setSubtopicThumbnailBgColor(
          ctrl.topic, ctrl.subtopic.getId(), newThumbnailBgColor);
        ctrl.editableThumbnailBgColor = newThumbnailBgColor;
      };

      ctrl.resetErrorMsg = function() {
        ctrl.errorMsg = null;
      };

      ctrl.isSkillDeleted = function(skillSummary) {
        return skillSummary.getDescription() === null;
      };

      ctrl.getSkillEditorUrl = function(skillId) {
        return UrlInterpolationService.interpolateUrl(
          SKILL_EDITOR_URL_TEMPLATE, {
            skillId: skillId
          }
        );
      };

      /**
       * @param {string|null} oldSubtopicId - The id of the subtopic from
       *    which the skill is to be moved, or null if the origin is the
       *    uncategorized section.
       * @param {SkillSummary} skillSummary - The summary of the skill
       * that is to be moved.
      */
      ctrl.onMoveSkillStart = function(oldSubtopicId, skillSummary) {
        ctrl.skillSummaryToMove = skillSummary;
        ctrl.oldSubtopicId = oldSubtopicId ? oldSubtopicId : null;
      };

      /**
       * @param {string|null} newSubtopicId - The subtopic to which the
       *    skill is to be moved, or null if the destination is the
       *    uncategorized section.
      */
      ctrl.onMoveSkillFinish = function(newSubtopicId) {
        if (newSubtopicId === ctrl.oldSubtopicId) {
          return;
        }

        if (newSubtopicId === null) {
          TopicUpdateService.removeSkillFromSubtopic(
            ctrl.topic, ctrl.oldSubtopicId, ctrl.skillSummaryToMove);
        } else {
          TopicUpdateService.moveSkillToSubtopic(
            ctrl.topic, ctrl.oldSubtopicId, newSubtopicId,
            ctrl.skillSummaryToMove);
        }
        _initEditor();
      };

      ctrl.deleteUncategorizedSkillFromTopic = function(skillSummary) {
        TopicUpdateService.removeUncategorizedSkill(
          ctrl.topic, skillSummary);
        _initEditor();
      };

      ctrl.updateHtmlData = function() {
        if (ctrl.htmlData !==
                ctrl.subtopicPage.getPageContents().getHtml()) {
          var subtitledHtml = angular.copy(
            ctrl.subtopicPage.getPageContents().getSubtitledHtml());
          subtitledHtml.setHtml(ctrl.htmlData);
          TopicUpdateService.setSubtopicPageContentsHtml(
            ctrl.subtopicPage, ctrl.subtopic.getId(), subtitledHtml);
          TopicEditorStateService.setSubtopicPage(ctrl.subtopicPage);
          ctrl.schemaEditorIsShown = false;
        }
      };

      ctrl.showSchemaEditor = function() {
        ctrl.schemaEditorIsShown = true;
      };

      ctrl.createSkill = function() {
        EntityCreationService.createSkill();
      };

      ctrl.$onInit = function() {
        ctrl.SUBTOPIC_PAGE_SCHEMA = {
          type: 'html',
          ui_config: {
            rows: 100
          }
        };
        ctrl.htmlData = '';
        ctrl.schemaEditorIsShown = false;
        $scope.$on(EVENT_TOPIC_INITIALIZED, _initEditor);
        $scope.$on(EVENT_TOPIC_REINITIALIZED, _initEditor);
        $scope.$on(EVENT_SUBTOPIC_PAGE_LOADED, function() {
          ctrl.subtopicPage = (
            TopicEditorStateService.getSubtopicPage());
          var pageContents = ctrl.subtopicPage.getPageContents();
          ctrl.htmlData = pageContents.getHtml();
        });

        _initEditor();
      };
    }
  ]
});
