# coding: utf-8
#
# Copyright 2014 The Oppia Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, softwar
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Tests for classification of 2D coordinates."""

__author__ = 'Sean Lip'

from extensions.rules import coord_two_dim
import test_utils


class CoordTwoDimRuleUnitTests(test_utils.GenericTestBase):
    """Tests for rules operating on CoordTwoDim objects."""

    def test_within_rule(self):
        self.assertTrue(coord_two_dim.Within(20025, [0,180]).eval([0,0]))
        self.assertTrue(coord_two_dim.Within(10015, [0,90]).eval([0,0]))
        self.assertTrue(coord_two_dim.Within(10015, [0,-90]).eval([0,0]))
        self.assertTrue(coord_two_dim.Within(20025, [0,-180]).eval([0,0]))

        self.assertFalse(coord_two_dim.Within(20015, [0,180]).eval([0,0]))
        self.assertFalse(coord_two_dim.Within(10005, [0,90]).eval([0,0]))
        self.assertFalse(coord_two_dim.Within(10005, [0,-90]).eval([0,0]))
        self.assertFalse(coord_two_dim.Within(20015, [0,-180]).eval([0,0]))

        self.assertTrue(coord_two_dim.Within(0.1, [90, 180]).eval([90,0]))
        self.assertTrue(coord_two_dim.Within(0.1, [90, -180]).eval([90,0]))
        self.assertTrue(coord_two_dim.Within(0.1, [-90,-180]).eval([-90,0]))
        self.assertTrue(coord_two_dim.Within(0.1, [-90, 180]).eval([-90,0]))

        self.assertTrue(coord_two_dim.Within(11370, [55, -45]).eval([-37,-97]))
        self.assertTrue(coord_two_dim.Within(15890, [-81, 117]).eval([47,-17]))
        self.assertFalse(coord_two_dim.Within(15500, [-42, 3]).eval([16,-142]))
        self.assertFalse(coord_two_dim.Within(6220, [27, -123]).eval([83,-127]))



    def test_not_within_rule(self):
        self.assertFalse(coord_two_dim.NotWithin(20025, [0,180]).eval([0,0]))
        self.assertFalse(coord_two_dim.NotWithin(10015, [0,90]).eval([0,0]))
        self.assertFalse(coord_two_dim.NotWithin(10025, [0,-90]).eval([0,0]))
        self.assertFalse(coord_two_dim.NotWithin(20025, [0,-180]).eval([0,0]))

        self.assertTrue(coord_two_dim.NotWithin(20015, [0,180]).eval([0,0]))
        self.assertTrue(coord_two_dim.NotWithin(10005, [0,90]).eval([0,0]))
        self.assertTrue(coord_two_dim.NotWithin(10005, [0,-90]).eval([0,0]))
        self.assertTrue(coord_two_dim.NotWithin(20015, [0,-180]).eval([0,0]))

        self.assertFalse(coord_two_dim.NotWithin(0.1, [90, 180]).eval([90,0]))
        self.assertFalse(coord_two_dim.NotWithin(0.1, [90, -180]).eval([90,0]))
        self.assertFalse(coord_two_dim.NotWithin(0.1, [-90,-180]).eval([-90,0]))
        self.assertFalse(coord_two_dim.NotWithin(0.1, [-90, 180]).eval([-90,0]))

        self.assertFalse(coord_two_dim.NotWithin(11370, [55, -45]).eval([-37,-97]))
        self.assertFalse(coord_two_dim.NotWithin(15890, [-81, 117]).eval([47,-17]))
        self.assertTrue(coord_two_dim.NotWithin(15500, [-42, 3]).eval([16,-142]))
        self.assertTrue(coord_two_dim.NotWithin(6220, [27, -123]).eval([83,-127]))
